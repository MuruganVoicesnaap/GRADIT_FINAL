import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { FONT, ICON } from '../../constants/constants';

const FileUpload = ({ fileName, progressText, progress, color, onCancel }) => (
    <View>
        <View style={styles.container}>
            <Text style={styles.fileName}>{fileName}</Text>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.progressText}>{progressText}</Text>
                <TouchableOpacity onPress={onCancel}>
                    <Icons
                        name={ICON.CANCEL}
                        size={15}
                        color="#A3A3A3"
                    />
                </TouchableOpacity>
            </View>
        </View>
        <ProgressBar progress={progress} color={color} style={{ width: "95%", height: 2.5 }} />
    </View>
);

export default FileUpload;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5
    },
    fileName: {
        fontFamily: FONT.primaryBold,
        fontSize: 12,
    },
    progressText: {
        fontSize: 10,
        color: '#8A8A8A',
        marginRight: 5,
    }
});