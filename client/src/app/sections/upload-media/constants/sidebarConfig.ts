import { sidebarItem } from '../side-bar.model';

export const SHOW_ELEMENT = {
  showSettings: 'show-setting',
  showUploadedVideos: 'show-uploaded-videos',
};

export const sidebarItems: sidebarItem[] = [
  {
    id: 'uploadedVideosItem',
    class: 'video-list-item',
    action: 'show-uploaded-videos',
    svg: '/icons/svg-file.svg',
    isActive: false,
  },
  {
    id: 'settingsItem',
    class: 'settings-item',
    action: 'show-setting',
    svg: '/icons/svg-cog.svg',
    isActive: false,
  },
];
