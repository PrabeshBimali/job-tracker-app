import AddApplication from "../components/AddApplication";
import ApplicationView from "../components/ApplicationView";
import Dashboard from "../components/Dashboard";
import MainLayout from "../layouts/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <Dashboard/>
      <AddApplication/>
      <ApplicationView/>
    </MainLayout>
  )
}