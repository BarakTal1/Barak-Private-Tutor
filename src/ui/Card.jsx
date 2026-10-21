export default function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`rounded-card bg-surf p-5 shadow-card ${className}`} {...props}>
      {children}
    </Tag>
  )
}
