create or replace function public.settle_wallet_topup(
  p_store_id text,
  p_invoice_id text,
  p_invoice_status text,
  p_invoice jsonb
)
returns jsonb
language plpgsql
as $$
declare
  v_topup record;
  v_status text;
begin
  select *
  into v_topup
  from wallet_topups
  where btcpay_store_id = p_store_id
    and btcpay_invoice_id = p_invoice_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'topup_not_found');
  end if;

  if v_topup.status = 'settled' then
    return jsonb_build_object('ok', true, 'alreadySettled', true);
  end if;

  v_status := lower(coalesce(p_invoice_status, ''));
  if v_status not in ('confirmed', 'complete') then
    return jsonb_build_object('ok', false, 'reason', 'status_not_settled');
  end if;

  insert into wallet_transactions (
    wallet_id,
    type,
    direction,
    amount,
    reference,
    metadata
  ) values (
    v_topup.wallet_id,
    'topup',
    'credit',
    v_topup.credits,
    p_invoice_id,
    jsonb_build_object('btcpay', p_invoice, 'status', p_invoice_status)
  );

  update wallets
  set balance_credits = balance_credits + v_topup.credits
  where id = v_topup.wallet_id;

  update wallet_topups
  set status = 'settled',
      metadata = coalesce(metadata, '{}'::jsonb) ||
        jsonb_build_object(
          'btcpay',
          p_invoice,
          'status',
          p_invoice_status,
          'settled_at',
          now()
        ),
      updated_at = now()
  where id = v_topup.id;

  return jsonb_build_object(
    'ok',
    true,
    'credited',
    v_topup.credits,
    'walletId',
    v_topup.wallet_id
  );
end;
$$;
