create unique index if not exists wallet_tx_unique_topup_ref
  on public.wallet_transactions (wallet_id, reference, type)
  where type = 'topup';

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
  v_existing_tx_id uuid;
  v_inserted_tx_id uuid;
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

  select id
  into v_existing_tx_id
  from public.wallet_transactions
  where wallet_id = v_topup.wallet_id
    and reference = p_invoice_id
    and type = 'topup'
  limit 1;

  if v_existing_tx_id is not null then
    update wallet_topups
    set status = 'settled',
        updated_at = now(),
        metadata = coalesce(metadata, '{}'::jsonb) ||
          jsonb_build_object(
            'btcpay',
            p_invoice,
            'status',
            p_invoice_status,
            'settled_at',
            now()
          )
    where id = v_topup.id;

    return jsonb_build_object(
      'ok',
      true,
      'alreadySettled',
      true,
      'transactionId',
      v_existing_tx_id
    );
  end if;

  insert into public.wallet_transactions (
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
  )
  on conflict do nothing
  returning id
  into v_inserted_tx_id;

  if v_inserted_tx_id is null then
    select id
    into v_existing_tx_id
    from public.wallet_transactions
    where wallet_id = v_topup.wallet_id
      and reference = p_invoice_id
      and type = 'topup'
    limit 1;

    update wallet_topups
    set status = 'settled',
        updated_at = now(),
        metadata = coalesce(metadata, '{}'::jsonb) ||
          jsonb_build_object(
            'btcpay',
            p_invoice,
            'status',
            p_invoice_status,
            'settled_at',
            now()
          )
    where id = v_topup.id;

    return jsonb_build_object(
      'ok',
      true,
      'alreadySettled',
      true,
      'transactionId',
      v_existing_tx_id
    );
  end if;

  update wallets
  set balance_credits = balance_credits + v_topup.credits,
      updated_at = now()
  where id = v_topup.wallet_id;

  update wallet_topups
  set status = 'settled',
      updated_at = now(),
      metadata = coalesce(metadata, '{}'::jsonb) ||
        jsonb_build_object(
          'btcpay',
          p_invoice,
          'status',
          p_invoice_status,
          'settled_at',
          now()
        )
  where id = v_topup.id;

  return jsonb_build_object(
    'ok',
    true,
    'settled',
    true,
    'credited',
    v_topup.credits,
    'walletId',
    v_topup.wallet_id,
    'transactionId',
    v_inserted_tx_id
  );
end;
$$;
