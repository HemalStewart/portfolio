/**
 * Code shown under each featured project's X-ray lens. These are illustrative
 * sketches of each codebase's shape (stack, structure, flows from the case
 * study) — not excerpts of client source, which stays private.
 */
export const codeSamples: Record<
  string,
  { file: string; code: string; theme: "dark" | "light" }
> = {
  linkforex: {
    theme: "dark",
    file: "app/admin/transfers/page.tsx",
    code: `// illustrative — real source on request
export default async function TransfersPage({ searchParams }: Props) {
  const { status = "pending", branch } = await searchParams;
  const transfers = await api.transfers.list({ status, branch });

  return (
    <AdminShell title="Transfers" permission="transfers.view">
      <TransferFilters status={status} branch={branch} />
      <DataTable
        rows={transfers}
        columns={[remitter, receiver, amount, kycStatus]}
        onApprove={approveTransfer}
      />
    </AdminShell>
  );
}`,
  },
  "chatsoul-ai": {
    theme: "dark",
    file: "lib/features/chat/chat_screen.dart",
    code: `// illustrative — real source on request
class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key, required this.companion});
  final Companion companion;

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _messages = <Message>[];

  Future<void> send(String text) async {
    final reply = await api.post('/chat/send', body: {
      'companion_id': widget.companion.id,
      'message': text,
    });
    setState(() => _messages.addAll([Message.me(text), reply]));
  }
}`,
  },
  writescan: {
    theme: "light",
    file: "lib/features/scan/scan_controller.dart",
    code: `// illustrative — real source on request
final scanProvider =
    AsyncNotifierProvider<ScanController, ScanResult?>(ScanController.new);

class ScanController extends AsyncNotifier<ScanResult?> {
  final _recognizer = TextRecognizer(script: TextRecognitionScript.latin);

  @override
  Future<ScanResult?> build() async => null;

  Future<void> scan(InputImage image, ScanMode mode) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final text = await _recognizer.processImage(image);
      final result = ScanResult.from(text, mode: mode);
      await ref.read(documentsDb).insert(result.toRow()); // offline-first
      return result;
    });
  }
}`,
  },
  pdms: {
    theme: "light",
    file: "modules/attendance/controllers/Attendance.php",
    code: `<?php // illustrative — real source on request
class Attendance extends MX_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('attendance_model');
        $this->auth->require_role(['admin', 'teacher']);
    }

    public function mark($class_id)
    {
        $students = $this->attendance_model->roster($class_id);
        $this->form_validation->set_rules('date', 'Date', 'required');

        if ($this->form_validation->run()) {
            $this->attendance_model->save($class_id, $this->input->post());
            redirect("attendance/mark/{$class_id}");
        }
        $this->template->render('attendance/mark', compact('students'));
    }
}`,
  },
};
