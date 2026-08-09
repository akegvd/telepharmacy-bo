import { Modal } from "@/shared/components/Modal";
import { TaskDetailContent } from "@/modules/tasks/components/TaskDetailContent";

export default async function InterceptedTaskModal({ params }: PageProps<"/task/[id]">) {
  const { id } = await params;

  return (
    <Modal>
      <TaskDetailContent id={id} />
    </Modal>
  );
}
