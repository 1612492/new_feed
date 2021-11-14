export function truncate(target, maxLength) {
  if (target.length > maxLength) {
    return target.slice(0, maxLength) + '...';
  }

  return target;
}

export function merge(...args) {
  return args.join(' ');
}

export function getPathname(link) {
  const parts = link.split('/').filter(Boolean);
  return parts[parts.length - 1];
}
