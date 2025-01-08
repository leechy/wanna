import { useThemeColor } from '@/hooks/useThemeColor';
import { AccordionBlockProps } from '@/components/AccordionBlock';
import { Accordion } from '@/components/Accordion';
import Page from '@/components/Page';

export default function ProjectsScreen() {
  const primaryColor = useThemeColor({}, 'primary');

  const blocks: AccordionBlockProps[] = [
    {
      title: 'Present continuous',
      // color: primaryColor,
      newItemLabel: 'New project',
      emptyText: 'Time to start something new!',
      items: [
        {
          type: 'project',
          id: '1',
          label: 'How to Wanna Wanna',
          deadline: 1735084800000,
          quantity: 6,
          inProgress: false,
        },
        {
          type: 'project',
          id: '2',
          label: 'Neon Guitar',
          quantity: 6,
          inProgress: 1,
          completed: 4,
          shared: ['Max', 'Alex'],
        },
        {
          type: 'project',
          id: '3',
          label: 'Trash bin cabinet',
          quantity: 12,
          inProgress: 0,
          completed: 3,
          shared: ['Soulntse'],
        },
      ],
    },
    {
      title: 'Past perfect',
      items: [
        {
          type: 'item',
          id: '3',
          label: 'Mozarella',
          quantity: 2,
          inProgress: true,
        },
        {
          type: 'item',
          id: '4',
          label: 'Coca Cola Zero',
          quantity: 1,
          inProgress: true,
        },
      ],
      emptyText: 'Hurry up to finish your first project!',
    },
  ];

  return (
    <Page>
      <Accordion title="Projects" blocks={blocks} openBlock={0} />
    </Page>
  );
}
