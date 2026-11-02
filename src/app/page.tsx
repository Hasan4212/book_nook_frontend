import Banner from "@/components/Banner";
import NewArrivals from "@/components/Body/NewArrivals";
import HowBorrowingWorks from "@/components/Body/HowBorrowingWorks";
import TopCategories from "@/components/Body/TopCategories";

export default function Home() {
  return (
    <div>
      <Banner />
      <NewArrivals />
      <HowBorrowingWorks />
      <TopCategories />
    </div>
  );
}
