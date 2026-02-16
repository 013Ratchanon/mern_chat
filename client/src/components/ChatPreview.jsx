export default function ChatPreview() {
  return (
    <div className="rounded-xl border border-base-300 bg-base-200 overflow-hidden max-w-md">
      <div className="p-3 border-b border-base-300 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content text-sm font-bold">
          J
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-base-content">John Doe</p>
          <p className="text-xs text-base-content/60">Online</p>
        </div>
      </div>
      <div className="p-4 space-y-3 min-h-[120px]">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-primary shrink-0" />
          <div className="rounded-2xl rounded-tl-none px-4 py-2 bg-base-300 max-w-[85%]">
            <p className="text-sm text-base-content">Hey! How&apos;s it going?</p>
            <p className="text-xs text-base-content/60 mt-0.5">12:00 PM</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <div className="rounded-2xl rounded-tr-none px-4 py-2 bg-primary text-primary-content max-w-[85%]">
            <p className="text-sm">I&apos;m doing great! Just working on some new features.</p>
            <p className="text-xs opacity-80 mt-0.5">12:00 PM</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary shrink-0" />
        </div>
      </div>
      <div className="p-3 border-t border-base-300 flex gap-2">
        <input
          type="text"
          readOnly
          value="This is a preview"
          className="flex-1 input input-bordered input-sm bg-base-100 text-base-content"
        />
        <button type="button" className="btn btn-primary btn-sm btn-square" aria-label="Send">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
