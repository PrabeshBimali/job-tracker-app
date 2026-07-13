import AddApplication from "../components/form/AddApplication";
import ApplicationView from "../components/applications/ApplicationView";
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