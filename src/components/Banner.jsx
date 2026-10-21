export default function Banner({ tone = 'info', children }) {
  return <div role={tone === 'danger' ? 'alert' : 'status'} className={`banner banner-${tone}`}>{children}</div>;
}
