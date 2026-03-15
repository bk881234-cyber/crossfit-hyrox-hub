// next-intl v4: createNavigation replaces createSharedPathnamesNavigation
import { createNavigation } from 'next-intl/navigation'
import { routing } from '@/i18n/routing'

export const { Link, redirect, usePathname, useRouter, getPathname, permanentRedirect } =
  createNavigation(routing)
