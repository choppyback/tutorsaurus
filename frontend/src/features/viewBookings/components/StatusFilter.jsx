import PillFilter from "../../../shared/components/PillFilter";

const STATUS_FILTERS = [
  { label: "All lessons", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function StatusFilter({ active, onChange }) {
  return (
    <PillFilter options={STATUS_FILTERS} active={active} onChange={onChange} />
  );
}
