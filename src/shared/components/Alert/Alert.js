const VARIANT_STYLES = {
  info: {
    icon: 'fa-circle-info',
    color: 'var(--accent-color)'
  },
  warning: {
    icon: 'fa-triangle-exclamation',
    color: 'var(--secondary-color)'
  },
  danger: {
    icon: 'fa-circle-xmark',
    color: 'var(--primary-color)'
  },
  success: {
    icon: 'fa-circle-check',
    color: 'var(--accent-color)'
  }
}

export const Alert = ({ variant = 'info', title, text, icon }) => {
  const style = VARIANT_STYLES[variant] ?? VARIANT_STYLES.info
  const iconClass = icon ?? style.icon

  return `
    <div class="app-alert app-alert-${variant}" style="--alert-color: ${style.color}">
      <i class="fa-solid ${iconClass} app-alert-icon"></i>
      <div>
        <p class="app-alert-title mb-1">${title}</p>
        ${text ? `<p class="app-alert-text mb-0">${text}</p>` : ''}
      </div>
    </div>
  `
}
