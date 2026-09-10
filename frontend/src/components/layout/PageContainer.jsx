import cn from '../../utils/cn';

export default function PageContainer({ children, className, ...props }) {
  return (
    <div {...props} className={cn('page-shell', className)}>
      {children}
    </div>
  );
}
