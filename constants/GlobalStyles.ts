import { Platform, StyleSheet } from 'react-native';

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
    borderWidth: 1,
    borderColor: 'transparent',
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
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: -12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: Platform.OS === 'ios' ? '#00000033' : '#00000001',
  },
  menuContainer: {
    position: 'absolute',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
