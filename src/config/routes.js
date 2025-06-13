import GardenDesigner from '@/components/pages/GardenDesigner';
import MyGardens from '@/components/pages/MyGardens';
import Meditation from '@/components/pages/Meditation';
import Journal from '@/components/pages/Journal';

export const routes = [
  {
    id: 'garden',
    label: 'Garden Designer',
    path: '/garden',
    icon: 'Palette',
    component: GardenDesigner
  },
  {
    id: 'my-gardens',
    label: 'My Gardens',
    path: '/my-gardens',
    icon: 'Image',
    component: MyGardens
  },
  {
    id: 'meditation',
    label: 'Meditation',
    path: '/meditation',
    icon: 'Brain',
    component: Meditation
  },
  {
    id: 'journal',
    label: 'Journal',
    path: '/journal',
    icon: 'BookOpen',
    component: Journal
  }
];