import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void
export type LayoutModule = (ctx: ViteSSGContext) => void
