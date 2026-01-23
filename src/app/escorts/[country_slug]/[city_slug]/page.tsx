import { SearchPageContent } from "@/components/search/search-page-content";

type Params = Promise<{ country_slug: string; city_slug: string }>;

export default async function CitySearchPage({ params }: { params: Params }) {
    const resolvedParams = await params;
    const { country_slug, city_slug } = resolvedParams;

    return (
        <SearchPageContent
            initialCountrySlug={country_slug}
            initialCitySlug={city_slug}
        />
    );
}
