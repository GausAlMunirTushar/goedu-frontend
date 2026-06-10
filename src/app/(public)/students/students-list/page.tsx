import StudentsList from "@/components/pages/academic/StudentsList";

export const metadata = {
  title: "Students List | ePathshala",
  description: "Full list of enrolled students by class, section and session.",
};

export default function Page() {
  return <StudentsList />;
}
