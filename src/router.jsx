import { Children, cloneElement, createContext, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext({ pathname: '/', navigate: () => {} });
const ParamsContext = createContext({});

export function BrowserRouter({ children }) {
  const [pathname, setPathname] = useState(() => window.location.pathname || '/');
  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const navigate = (to) => {
    const next = to.startsWith('/') ? to : `/${to}`;
    window.history.pushState({}, '', next);
    setPathname(next);
  };
  const value = useMemo(() => ({ pathname, navigate }), [pathname]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Link({ to, onClick, children, ...props }) {
  const { navigate } = useContext(RouterContext);
  return <a href={to} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  }} {...props}>{children}</a>;
}

export function NavLink({ to, className = '', children, ...props }) {
  const { pathname } = useContext(RouterContext);
  const active = pathname === to || pathname.startsWith(`${to}/`);
  const resolvedClass = typeof className === 'function' ? className({ isActive: active }) : `${className} ${active ? 'active' : ''}`.trim();
  return <Link to={to} className={resolvedClass} {...props}>{children}</Link>;
}

export function Route() { return null; }

function matchPath(pattern, pathname) {
  if (pattern === '*' || pattern === '/*') return { params: {} };
  const normalized = pattern.startsWith('/') ? pattern : `/${pattern}`;
  const patternParts = normalized.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const part = patternParts[index];
    if (part.startsWith(':')) params[part.slice(1)] = decodeURIComponent(pathParts[index]);
    else if (part !== pathParts[index]) return null;
  }
  return { params };
}

export function Routes({ children }) {
  const { pathname } = useContext(RouterContext);
  const routes = Children.toArray(children);
  for (const route of routes) {
    const match = matchPath(route.props.path, pathname);
    if (match) return <ParamsContext.Provider value={match.params}>{route.props.element}</ParamsContext.Provider>;
  }
  return null;
}

export function useNavigate() { return useContext(RouterContext).navigate; }
export function useLocation() { const { pathname } = useContext(RouterContext); return { pathname }; }
export function useParams() { return useContext(ParamsContext); }
