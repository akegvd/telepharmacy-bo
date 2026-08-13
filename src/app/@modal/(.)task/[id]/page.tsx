import { TaskDetailContent } from "@/modules/dashboard/components/TaskDetailContent";
import { Modal } from "@/shared/components/Modal";

export default async function InterceptedTaskModal({ params }: PageProps<"/task/[id]">) {
  const { id } = await params;

  return (
    <Modal>
      <TaskDetailContent id={id} />
    </Modal>
  );
}
