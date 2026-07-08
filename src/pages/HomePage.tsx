import AddApplication from "../components/AddApplication";
import ApplicationsView from "../components/ApplicationsView";
import Dashboard from "../components/Dashboard";
import MainLayout from "../layouts/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <Dashboard/>
      <AddApplication/>
      <ApplicationsView/>
    </MainLayout>
  )
}