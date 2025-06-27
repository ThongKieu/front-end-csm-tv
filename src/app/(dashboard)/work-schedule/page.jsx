import WorkScheduleClient from "./WorkScheduleClient";

export const metadata = {
  title: "Lịch làm việc" + " - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Lịch làm việc",
}

export default function WorkSchedulePage() {
  return <WorkScheduleClient />;
} 