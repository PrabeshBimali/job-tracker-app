import ApplicationView from "../components/applications/ApplicationView";
import Dashboard from "../components/Dashboard";
import AddApplicationButton from "../components/form/AddApplicationButton";
import MainLayout from "../layouts/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <Dashboard/>
      <AddApplicationButton/>
      <ApplicationView/>
    </MainLayout>
  )
}