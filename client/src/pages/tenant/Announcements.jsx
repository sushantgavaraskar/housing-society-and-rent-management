import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import API from "../../lib/axios";
import { toast } from "sonner";
import AnnouncementList from "../../components/tenant/AnnouncementList";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/tenant/announcements")
      .then(res => setAnnouncements(res.data.data))
      .catch(() => toast.error("Failed to load announcements"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageContainer title="Society Announcements">
        {loading ? <p>Loading...</p> : <AnnouncementList items={announcements} />}
      </PageContainer>
    </DashboardLayout>
  );
}
