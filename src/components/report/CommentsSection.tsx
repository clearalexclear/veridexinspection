export function CommentsSection({ comments }: { comments: string }) {
  return (
    <section id="comments" className="report-section">
      <h2 className="section-title">
        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
        Inspector Comments
      </h2>
      <div className="report-card p-6">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{comments}</p>
      </div>
    </section>
  );
}
