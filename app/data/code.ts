/**
 * Code behind each featured project's Interface / Code switch. These are
 * illustrative sketches of each codebase's shape (stack, structure, flows from
 * the case study) — not excerpts of client source, which stays private; the
 * editor's status bar says so. The editor sizes its font to fit every line,
 * so keep samples to about 15 lines of 65 characters or fewer.
 */
export const codeSamples: Record<
  string,
  { file: string; code: string; theme: "dark" | "light" }
> = {
  linkforex: {
    theme: "dark",
    file: "app/admin/transfers/page.tsx",
    code: `export default async function Page({ searchParams }: Props) {
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
    code: `class _ChatScreenState extends State<ChatScreen> {
  final _messages = <Message>[];

  Future<void> send(String text) async {
    final reply = await api.post('/chat/send', body: {
      'companion_id': widget.companion.id,
      'message': text,
    });
    setState(() {
      _messages.addAll([Message.me(text), reply]);
    });
  }
}`,
  },
  writescan: {
    theme: "light",
    file: "lib/features/scan/scan_controller.dart",
    code: `class ScanController extends AsyncNotifier<ScanResult?> {
  final _ocr = TextRecognizer();

  @override
  Future<ScanResult?> build() async => null;

  Future<void> scan(InputImage image, ScanMode mode) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final text = await _ocr.processImage(image);
      final result = ScanResult.from(text, mode: mode);
      await ref.read(documentsDb).insert(result.toRow());
      return result; // stored offline-first
    });
  }
}`,
  },
  pdms: {
    theme: "light",
    file: "modules/attendance/controllers/Attendance.php",
    code: `<?php
class Attendance extends MX_Controller
{
    public function mark($class_id)
    {
        $this->auth->require_role(['admin', 'teacher']);

        if ($rows = $this->input->post('rows')) {
            $this->attendance->save($class_id, $rows);
            redirect("attendance/mark/{$class_id}");
        }
        $students = $this->attendance->roster($class_id);
        $this->template->render('mark', compact('students'));
    }
}`,
  },
};
