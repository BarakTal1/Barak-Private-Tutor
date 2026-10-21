// Small line icons. They are decorative: the text next to them carries the meaning.
function Icon({ children, size = 20, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {children}
    </svg>
  )
}

export const UploadIcon = (props) => (
  <Icon {...props}>
    <path d="M12 16V4m0 0L7 9m5-5 5 5" />
    <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </Icon>
)
export const FileIcon = (props) => (
  <Icon {...props}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </Icon>
)
export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)
export const SlidersIcon = (props) => (
  <Icon {...props}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </Icon>
)
// In a Hebrew page "forward" points to the left and "back" points to the right (rtl: flips the arrow).
export const ArrowStartIcon = (props) => (
  <Icon {...props}>
    <path d="M5 12h14m-6-6 6 6-6 6" className="origin-center rtl:-scale-x-100" />
  </Icon>
)
export const ArrowEndIcon = (props) => (
  <Icon {...props}>
    <path d="M19 12H5m6-6-6 6 6 6" className="origin-center rtl:-scale-x-100" />
  </Icon>
)
export const InfoIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5m0-8v.01" />
  </Icon>
)
export const LockIcon = (props) => (
  <Icon {...props}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
)
export const EyeIcon = (props) => (
  <Icon {...props}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
)
export const EyeOffIcon = (props) => (
  <Icon {...props}>
    <path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.6 7.7C3.9 9.4 2 12 2 12s3.6 6 10 6a9.7 9.7 0 0 0 4.4-1" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </Icon>
)
export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="M5 12.5 10 17.5 19 7.5" />
  </Icon>
)
export const AlertIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3 2 20h20z" />
    <path d="M12 10v4m0 3v.01" />
  </Icon>
)
export const RefreshIcon = (props) => (
  <Icon {...props}>
    <path d="M20 11a8 8 0 0 0-14.5-4M4 4v4h4M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4" />
  </Icon>
)
