export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>← Prev</button>
      <span>{page} / {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next →</button>
    </div>
  );
}
