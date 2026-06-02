import EconomyView from "@/components/dashboard/EconomyView";
import PlanGate from "@/components/dashboard/PlanGate";

export default function EconomyPage() {
  return (
    <PlanGate feature="economy">
      <EconomyView />
    </PlanGate>
  );
}
