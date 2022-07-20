const getLayoutComponent = (value) => {
  if (typeof value === 'function') return value
  if (typeof value === 'object' && typeof value.component === 'function') return value.component
  return 'div'
}

function DynamicLayout({layouts, children}) {
  const layoutValue = layouts?.[0];
  const layoutsArrayHasDeeperLayout = layouts?.[1];

  const LayoutComponent = getLayoutComponent(layoutValue)

  if (LayoutComponent && layoutsArrayHasDeeperLayout) return (
    <LayoutComponent {...layoutValue?.props}>
      <DynamicLayout layouts={layouts.slice(1)}>
        {children}
      </DynamicLayout>
    </LayoutComponent>
  )

  if (LayoutComponent) {
    return <LayoutComponent {...layoutValue?.props}>{children}</LayoutComponent>
  }

  return children
}

export default DynamicLayout
