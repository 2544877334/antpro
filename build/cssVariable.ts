const cssVariable = () => {
  return {
    theme: 'variable',
    // >>> Primary
    'primary-color': "~'var(--@{ant-prefix}-primary-color)'",
    'primary-color-hover': "~'var(--@{ant-prefix}-primary-color-hover)'",
    'primary-color-active': "~'var(--@{ant-prefix}-primary-color-active)'",
    'primary-color-outline': "~'var(--@{ant-prefix}-primary-color-outline)'",

    'processing-color': '@primary-color',

    // >>> Info
    'info-color': "~'var(--@{ant-prefix}-info-color)'",
    'info-color-deprecated-bg': "~'var(--@{ant-prefix}-info-color-deprecated-bg)'",

    'info-color-deprecated-border': "~'var(--@{ant-prefix}-info-color-deprecated-border)'",

    // >>> Success
    'success-color': "~'var(--@{ant-prefix}-success-color)'",
    'success-color-hover': "~'var(--@{ant-prefix}-success-color-hover)'",
    'success-color-active': "~'var(--@{ant-prefix}-success-color-active)'",
    'success-color-outline': "~'var(--@{ant-prefix}-success-color-outline)'",

    'success-color-deprecated-bg': "~'var(--@{ant-prefix}-success-color-deprecated-bg)'",

    'success-color-deprecated-border': "~'var(--@{ant-prefix}-success-color-deprecated-border)'",

    // >>> Warning
    'warning-color': "~'var(--@{ant-prefix}-warning-color)'",
    'warning-color-hover': "~'var(--@{ant-prefix}-warning-color-hover)'",
    'warning-color-active': "~'var(--@{ant-prefix}-warning-color-active)'",
    'warning-color-outline': "~'var(--@{ant-prefix}-warning-color-outline)'",

    'warning-color-deprecated-bg': "~'var(--@{ant-prefix}-warning-color-deprecated-bg)'",

    'warning-color-deprecated-border': "~'var(--@{ant-prefix}-warning-color-deprecated-border)'",

    // >>> Error
    'error-color': "~'var(--@{ant-prefix}-error-color)'",
    'error-color-hover': "~'var(--@{ant-prefix}-error-color-hover)'",
    'error-color-active': "~'var(--@{ant-prefix}-error-color-active)'",
    'error-color-outline': "~'var(--@{ant-prefix}-error-color-outline)'",
    'error-color-deprecated-bg': "~'var(--@{ant-prefix}-error-color-deprecated-bg)'",

    'error-color-deprecated-border': "~'var(--@{ant-prefix}-error-color-deprecated-border)'",

    // >>> Primary Level Color
    'primary-1': "~'var(--@{ant-prefix}-primary-1)'",
    'primary-2': "~'var(--@{ant-prefix}-primary-2)'",
    'primary-3': "~'var(--@{ant-prefix}-primary-3)'",
    'primary-4': "~'var(--@{ant-prefix}-primary-4)'",
    'primary-5': "~'var(--@{ant-prefix}-primary-5)'",
    'primary-6': "~'var(--@{ant-prefix}-primary-6)'",
    'primary-7': "~'var(--@{ant-prefix}-primary-7)'",

    // Link
    'link-hover-color': '@primary-color-hover',
    'link-active-color': '@primary-color-active',

    'table-selected-row-hover-bg': "~'var(--@{ant-prefix}-primary-color-active-deprecated-d-02)'",

    'picker-basic-cell-hover-with-range-color':
      "~'var(--@{ant-prefix}-primary-color-deprecated-l-35)'",

    'picker-date-hover-range-border-color': "~'var(--@{ant-prefix}-primary-color-deprecated-l-20)'",

    'calendar-column-active-bg': "~'var(--@{ant-prefix}-primary-color-active-deprecated-f-30)'",

    'slider-handle-color-focus': "~'var(--@{ant-prefix}-primary-color-deprecated-t-20)'",

    'slider-handle-color-focus-shadow': "~'var(--@{ant-prefix}-primary-color-deprecated-f-12)'",

    'slider-dot-border-color-active': "~'var(--@{ant-prefix}-primary-color-deprecated-t-50)'",

    'transfer-item-selected-hover-bg':
      "~'var(--@{ant-prefix}-primary-color-active-deprecated-d-02)'",

    'alert-success-border-color': '@success-color-deprecated-border',
    'alert-success-bg-color': '@success-color-deprecated-bg',
    'alert-info-border-color': '@info-color-deprecated-border',
    'alert-info-bg-color': '@info-color-deprecated-bg',
    'alert-warning-border-color': '@warning-color-deprecated-border',
    'alert-warning-bg-color': '@warning-color-deprecated-bg',
    'alert-error-border-color': '@error-color-deprecated-border',
    'alert-error-bg-color': '@error-color-deprecated-bg',
  };
};

export { cssVariable };
