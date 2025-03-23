import { AsideItem } from '../side-bar.model';

export const SHOW_ELEMENT = {
  showSettings: 'show-setting',
  showUploadedVideos: 'show-uploaded-videos',
};

export const asideLinks: AsideItem[] = [
  {
    id: 'film-strip',
    class: 'film-strip',
    action: 'show-uploaded-videos',
    svg: '/icons/file.svg',
    title: 'Your media',
    isActive: false,
  },
  {
    id: 'cog',
    class: 'cog',
    action: 'show-setting',
    svg: '/icons/cog.svg',
    title: 'Settings',
    isActive: false,
  },
];
