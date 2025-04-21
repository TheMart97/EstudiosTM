// Service Worker for notifications
self.addEventListener('install', event => {
  self.skipWaiting();
  console.log('Service Worker installed');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated');
  return self.clients.claim();
});

// Handle push notifications
self.addEventListener('push', event => {
  console.log('Push notification received', event);
  
  let data = { title: 'Recordatorio', body: 'Tienes una actividad pendiente' };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (error) {
    console.error('Error parsing notification data', error);
  }
  
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'view',
        title: 'Ver'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ],
    requireInteraction: true
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked', event);
  event.notification.close();
  
  // Handle action buttons
  if (event.action === 'view') {
    // Open app
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(clientList => {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return clients.openWindow(event.notification.data.url || '/');
      })
    );
  } else if (event.action === 'close') {
    console.log('Notification closed by user');
  }
});

// Handle notification close event
self.addEventListener('notificationclose', event => {
  console.log('Notification closed', event);
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  console.log('Background sync event', event);
  
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }
});

// Function to sync tasks when offline
async function syncTasks() {
  // This would implement offline sync functionality
  console.log('Syncing tasks from service worker');
}