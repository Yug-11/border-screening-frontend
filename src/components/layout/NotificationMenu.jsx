import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../ui/Button';
import Drawer from '../ui/Drawer';
import EmptyState from '../ui/EmptyState';
import StatusBadge from '../ui/StatusBadge';

export default function NotificationMenu({ notifications = [], description, destination }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        className="relative px-3"
        aria-label={'Notifications, ' + notifications.length + ' notices'}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Bell aria-hidden="true" className="icon-md" />
        <span className="text-caption font-semibold tabular-nums" aria-hidden="true">
          {notifications.length}
        </span>
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Notifications"
        description={description}
      >
        {notifications.length ? (
          <ul className="divide-y divide-default">
            {notifications.map((notification) => (
            <li key={notification.id} className="space-y-2 py-4 first:pt-0">
              <StatusBadge status={notification.severity} />
              <p className="font-semibold text-navy">{notification.title}</p>
              <p className="text-caption text-muted">
                {notification.queueNumber && 'Queue #' + notification.queueNumber + ' / '}
                {notification.ageLabel || notification.time || notification.created || 'Demo notice'}
              </p>
            </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No notifications" description="There are no notices to display." />
        )}
        {destination && (
          <Link
            to={destination}
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex min-h-10 items-center font-semibold text-primary hover:underline"
          >
            View alerts
          </Link>
        )}
      </Drawer>
    </>
  );
}
