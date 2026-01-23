import { SearchPageContent } from "@/components/search/search-page-content";

type Params = Promise<{ country_slug: string }>;

export default async function CountrySearchPage({ params }: { params: Params }) {
    const resolvedParams = await params;
    const { country_slug } = resolvedParams;

    return (
        <SearchPageContent
            initialCountrySlug={country_slug}
        />
    );
}
