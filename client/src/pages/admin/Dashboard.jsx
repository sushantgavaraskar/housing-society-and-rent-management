import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <PageContainer title="Admin Overview">
        <p className="text-gray-700">Welcome to the admin panel!</p>
      </PageContainer>
    </DashboardLayout>
  );
}
