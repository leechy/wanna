import { ReactNode } from 'react';

/**
 * Extracts the text from a given React component tree
 *
 * @param {ReactNode} component  The React component to extract text from
 * @returns {string}         The text content of the component
 */
export function extractText(component: ReactNode): string {
  if (typeof component === 'string') {
    return component;
  }

  if (Array.isArray(component)) {
    return component.map(extractText).join('');
  }

  if (typeof component === 'object' && component !== null) {
    if ('props' in component) {
      return extractText(component.props.children);
    }
  }

  return '';
}
