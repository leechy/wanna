import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  listItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  listItemAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemLeadButton: {
    padding: 5,
  },
  itemListLabelContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  itemListlabel: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    lineHeight: 18,
  },
  itemListLabelMetaContainer: {
    paddingTop: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginStart: -2,
    opacity: 0.6,
  },
  itemListLabelMeta: {
    fontFamily: 'Montserrat',
    fontSize: 11,
  },
  itemListLabelMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  itemListProgress: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
    minWidth: 40,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
});
