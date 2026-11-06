import { Link, useParams } from "react-router";
import { ArrowRight, CarFront, MapPin, Truck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

const AREAS = {
  "greater-noida": {
    name: "Greater Noida",
    title: "Self Drive Car Rental in Greater Noida | Go Trip",
    description:
      "Looking for self-drive car rental in Greater Noida? Explore hatchbacks, sedans, SUVs and 7-seater cars with Go Trip. Pickup and delivery options available.",
    intro:
      "Go Trip provides self-drive car rental options in Greater Noida for residents, students, professionals and families. Explore our fleet and contact our team to discuss your rental requirements.",
    detail:
      "Whether you need a compact car for everyday travel or an SUV for a family trip, explore available vehicles and confirm the arrangements directly with our team.",
  },
  "greater-noida-west": {
    name: "Greater Noida West",
    title: "Self Drive Car Rental in Greater Noida West | Go Trip",
    description:
      "Find self-drive rental cars in Greater Noida West with Go Trip. Explore hatchbacks, sedans, SUVs and 7-seater cars with pickup or delivery arrangements.",
    intro:
      "Looking for a self-drive car in Greater Noida West? Go Trip offers a range of rental vehicles for personal, family and professional travel.",
    detail:
      "Browse available cars, compare vehicle types and contact our team to confirm availability and pickup or delivery arrangements for your location.",
  },
  noida: {
    name: "Noida",
    title: "Self Drive Car Rental in Noida | Go Trip",
    description:
      "Book a self-drive rental car in Noida with Go Trip. Explore hatchbacks, sedans, SUVs and 7-seater cars with pickup and delivery options.",
    intro:
      "Go Trip serves customers looking for self-drive car rental options in Noida. Choose from different vehicle categories for personal, family and business travel.",
    detail:
      "Explore our fleet and enquire about the vehicle you need. Our team will confirm availability, rental terms and suitable handover arrangements.",
  },
  "noida-extension": {
    name: "Noida Extension",
    title: "Self Drive Car Rental in Noida Extension | Go Trip",
    description:
      "Explore self-drive car rental options in Noida Extension with Go Trip. Choose from hatchbacks, sedans, SUVs and 7-seater rental cars.",
    intro:
      "Need a self-drive rental car in Noida Extension? Go Trip offers different car categories for customers planning local travel, family outings and longer drives.",
    detail:
      "Contact our team to discuss your preferred car, rental dates and whether pickup or delivery is suitable for your location.",
  },
  delhi: {
    name: "Delhi",
    title: "Self Drive Car Rental in Delhi | Go Trip",
    description:
      "Looking for self-drive car rental in Delhi? Explore hatchbacks, sedans, SUVs and 7-seater rental cars with Go Trip. Enquire about pickup and delivery.",
    intro:
      "Go Trip serves customers looking for self-drive rental cars in Delhi. Explore our vehicle options for personal travel, family plans and professional journeys.",
    detail:
      "Check our available cars and speak with our team to confirm rental availability, pricing, eligibility and handover arrangements for Delhi.",
  },
  gurugram: {
    name: "Gurugram",
    title: "Self Drive Car Rental in Gurugram | Go Trip",
    description:
      "Find self-drive car rental options in Gurugram with Go Trip. Explore hatchbacks, sedans, SUVs and 7-seater cars with pickup or delivery arrangements.",
    intro:
      "Go Trip offers self-drive car rental options for customers in Gurugram. Explore vehicles for work travel, personal journeys and family plans.",
    detail:
      "Tell our team your preferred car and rental dates. We will help confirm availability, pricing and suitable pickup or delivery arrangements.",
  },
  ghaziabad: {
    name: "Ghaziabad",
    title: "Self Drive Car Rental in Ghaziabad | Go Trip",
    description:
      "Explore self-drive car rental in Ghaziabad with Go Trip. Choose from hatchbacks, sedans, SUVs and 7-seater rental cars.",
    intro:
      "Looking for a rental car in Ghaziabad? Go Trip provides self-drive vehicle options for personal, family and professional travel.",
    detail:
      "Browse our fleet and contact our team to discuss your rental requirements and confirm vehicle availability and handover arrangements.",
  },
  faridabad: {
    name: "Faridabad",
    title: "Self Drive Car Rental in Faridabad | Go Trip",
    description:
      "Book a self-drive rental car in Faridabad with Go Trip. Explore hatchbacks, sedans, SUVs and 7-seater vehicles with pickup and delivery options.",
    intro:
      "Go Trip serves customers looking for self-drive rental cars in Faridabad. Explore our vehicle categories for personal travel and family journeys.",
    detail:
      "Contact our team with your preferred car and dates so we can confirm availability, rental terms and suitable handover arrangements.",
  },
  "delhi-ncr": {
    name: "Delhi NCR",
    title: "Self Drive Car Rental Across Delhi NCR | Go Trip",
    description:
      "Looking for self-drive car rental across Delhi NCR? Go Trip serves Greater Noida, Noida, Delhi, Gurugram, Ghaziabad and Faridabad with pickup and delivery options.",
    intro:
      "Go Trip offers self-drive car rental options across Delhi NCR, serving customers in Greater Noida, Noida, Delhi, Gurugram, Ghaziabad and Faridabad.",
    detail:
      "Explore hatchbacks, sedans, SUVs and 7-seater cars. Contact our team to confirm availability, rental terms and pickup or delivery arrangements in your area.",
  },
} as const;

type AreaSlug = keyof typeof AREAS;

const AREA_LINKS = Object.entries(AREAS) as [
  AreaSlug,
  (typeof AREAS)[AreaSlug],
][];

export function LocationPage() {
  const { location } = useParams();

  // Main service-area directory
  if (!location) {
    return (
      <>
        <SEO
          title="Car Rental Service Areas in Delhi NCR | Go Trip"
          description="Explore Go Trip self-drive car rental service areas across Greater Noida, Noida, Delhi, Gurugram, Ghaziabad and Faridabad."
          path="/car-rental"
        />

        <section className="bg-ink py-16 text-white sm:py-24">
          <div className="container-page">
            <p className="eyebrow">Our service areas</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">
              Self Drive Car Rental Across Delhi NCR
            </h1>
            <p className="mt-5 max-w-2xl text-white/75">
              Go Trip serves customers across Greater Noida, Noida, Delhi and
              other Delhi NCR areas. Explore our service locations and contact
              our team to confirm pickup or delivery arrangements.
            </p>
          </div>
        </section>

        <section className="container-page py-14 sm:py-20">
          <h2 className="text-3xl font-bold">
            Find car rental services in your area
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Choose your location to explore Go Trip's self-drive car rental
            options.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AREA_LINKS.map(([slug, area]) => (
              <Link
                key={slug}
                to={`/car-rental/${slug}`}
                className="rounded-2xl border border-line p-6 transition hover:border-ink hover:shadow-md"
              >
                <MapPin className="size-6 text-gold-600" />
                <h3 className="mt-4 text-lg font-semibold">
                  Car Rental in {area.name}
                </h3>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                  Explore location <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </>
    );
  }

  const area = AREAS[location as AreaSlug];

  if (!area) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-3xl font-bold">Location not found</h1>
        <Button asChild className="mt-6">
          <Link to="/car-rental">View all service areas</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={area.title}
        description={area.description}
        path={`/car-rental/${location}`}
      />

      <section className="bg-ink py-16 text-white sm:py-24">
        <div className="container-page">
          <p className="eyebrow flex items-center gap-2">
            <MapPin className="size-4" />
            Go Trip service area
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl">
            Self Drive Car Rental in {area.name}
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-white/75">{area.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/cars">
                Explore cars <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outlineLight">
              <Link to="/enquire">Enquire now</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              Rental cars for your plans in {area.name}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{area.detail}</p>

            <h3 className="mt-8 text-xl font-semibold">
              Explore our car categories
            </h3>
            <ul className="mt-4 space-y-3 text-muted">
              <li className="flex items-center gap-3">
                <CarFront className="size-5 text-gold-600" />
                Hatchbacks and sedans
              </li>
              <li className="flex items-center gap-3">
                <CarFront className="size-5 text-gold-600" />
                SUVs and compact SUVs
              </li>
              <li className="flex items-center gap-3">
                <CarFront className="size-5 text-gold-600" />
                7-seater and MUV options
              </li>
            </ul>

            <Button asChild className="mt-8">
              <Link to="/cars">Browse available cars</Link>
            </Button>
          </div>

          <div className="rounded-2xl bg-cloud p-7 sm:p-9">
            <Truck className="size-9 text-gold-600" />
            <h2 className="mt-4 text-2xl font-bold">Pickup or car delivery</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Go Trip offers both customer pickup and car delivery arrangements.
              Contact our team to confirm the available handover option for your
              location and booking.
            </p>

            <h3 className="mt-6 font-semibold">How to get started</h3>
            <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-muted">
              <li>Explore the available cars.</li>
              <li>Send your rental enquiry and preferred dates.</li>
              <li>Confirm availability, pricing and eligibility.</li>
              <li>Agree on the pickup or delivery arrangement.</li>
            </ol>

            <Button asChild variant="outline" className="mt-7">
              <Link to="/how-it-works">How it works</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-cloud py-14">
        <div className="container-page">
          <h2 className="text-2xl font-bold">Other Go Trip service areas</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {AREA_LINKS.filter(([slug]) => slug !== location).map(
              ([slug, otherArea]) => (
                <Link
                  key={slug}
                  to={`/car-rental/${slug}`}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm hover:border-ink"
                >
                  {otherArea.name}
                </Link>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
