import { StyleSheet, Text, View } from 'react-native';

export const Tag = ({ tag }: {tag: string}) => {
    return (
        <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{tag}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    tagContainer: {
      display: 'flex',
      flexDirection: 'row',
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#D9DBEB',
      borderStyle: 'solid',
      opacity: 0.8,
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 10,
      paddingRight: 10,
    },
    tagText: {
      fontSize: 16,
      lineHeight: 20,
    },
  });
  