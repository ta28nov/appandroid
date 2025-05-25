import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button, Linking } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { DocumentStackParamList } from '../../navigation/types';
import { ROUTES } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import apiClient from '../../services/api';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { DOCUMENT_TYPES } from '../../utils/constants';

interface DocumentDetails {
  _id: string;
  title: string;
  description: string;
  type: string;
  sizeBytes?: number;
  originalFilename?: string;
  storageUrl?: string;
  createdBy: { _id: string; name: string; avatarUrl?: string };
  createdAt: string;
  updatedAt: string;
  tags: string[];
  sharedWith?: any[];
  isFavorite?: boolean;
  mimeType?: string;
}

type DocumentDetailScreenRouteProp = RouteProp<
  DocumentStackParamList,
  typeof ROUTES.MAIN.DOCUMENT_DETAIL
>;

const DocumentDetailScreen: React.FC = () => {
  const route = useRoute<DocumentDetailScreenRouteProp>();
  const { theme, isDarkMode } = useTheme();
  const documentId = route.params?.documentId;

  const [documentDetails, setDocumentDetails] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (documentId) {
      const fetchDocumentDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await apiClient.get(`/documents/${documentId}`);
          setDocumentDetails(response.data.document || response.data);
        } catch (err: any) {
          console.error("Lỗi khi tải chi tiết tài liệu:", err.response?.data || err.message);
          setError(err.response?.data?.message || err.message || 'Không thể tải chi tiết tài liệu.');
        } finally {
          setLoading(false);
        }
      };
      fetchDocumentDetails();
    }
  }, [documentId]);

  const handleDownload = async () => {
    if (documentDetails?._id) {
      try {
        const downloadUrlResponse = await apiClient.get(`/documents/${documentDetails._id}/download`);
        const urlToOpen = downloadUrlResponse.data.downloadUrl;
        
        if (urlToOpen) {
            const supported = await Linking.canOpenURL(urlToOpen);
            if (supported) {
                await Linking.openURL(urlToOpen);
            } else {
                alert(`Không thể mở URL: ${urlToOpen}`);
            }
        } else {
            alert('Không có đường dẫn tải xuống cho tài liệu này.');
        }
      } catch (err: any) {
        console.error("Lỗi khi lấy link tải:", err.response?.data || err.message);
        alert('Không thể lấy đường dẫn tải xuống.');
      }
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case DOCUMENT_TYPES.PDF:
        return { name: 'file-pdf-box', color: '#F40F02' };
      case DOCUMENT_TYPES.DOCX:
      case DOCUMENT_TYPES.DOC:
        return { name: 'file-word', color: '#2B579A' };
      case DOCUMENT_TYPES.XLSX:
      case DOCUMENT_TYPES.XLS:
        return { name: 'file-excel', color: '#217346' };
      case DOCUMENT_TYPES.PPTX:
      case DOCUMENT_TYPES.PPT:
        return { name: 'file-powerpoint', color: '#D24726' };
      case DOCUMENT_TYPES.IMAGE:
        return { name: 'file-image', color: '#FFB600' };
      case DOCUMENT_TYPES.TEXT:
        return { name: 'file-document-outline', color: '#888888' };
      default:
        if (Object.values(DOCUMENT_TYPES).includes(type)) {
            for (const [key, value] of Object.entries(DOCUMENT_TYPES)) {
                if (value === type) {
                    if (key === 'IMAGE') return { name: 'file-image', color: '#FFB600' };
                }
            }
        } else if (type.startsWith('image/')) {
            return { name: 'file-image', color: '#FFB600' };
        } else if (type === 'application/pdf') {
            return { name: 'file-pdf-box', color: '#F40F02' };
        }
        return { name: 'file-outline', color: theme.colors.secondary || '#888888' };
    }
  };

  if (!documentId) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Lỗi: Không tìm thấy ID tài liệu.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, marginTop: 10 }}>Đang tải chi tiết...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
        <Text style={{ color: theme.colors.error }}>Lỗi: {error}</Text>
      </View>
    );
  }

  if (!documentDetails) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
        <Text style={{ color: theme.colors.text }}>Không tìm thấy thông tin tài liệu.</Text>
      </View>
    );
  }

  const docIcon = getDocumentIcon(documentDetails.type);
  const fileSize = documentDetails.sizeBytes 
    ? (documentDetails.sizeBytes / (1024*1024)).toFixed(2) + ' MB' 
    : 'N/A';

  return (
    <ScrollView style={[styles.scrollContainer, { backgroundColor: theme.colors.background }]}>
      <View style={styles.contentView}>
        <View style={styles.headerContainer}>
          <Icon name={docIcon.name as any} size={40} color={docIcon.color} style={styles.docIcon} />
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
              {documentDetails.title}
            </Text>
             <Text style={[styles.metaText, { color: theme.colors.secondary || 'grey' }]}>
                {documentDetails.originalFilename || 'Không có tên file gốc'}
            </Text>
          </View>
        </View>

        <View style={styles.metaInfoContainer}>
            <View style={styles.metaItem}>
                <Icon name="account-circle-outline" size={16} color={theme.colors.secondary || 'grey'} />
                <Text style={[styles.metaText, { color: theme.colors.secondary || 'grey' }]}> {documentDetails.createdBy?.name || 'N/A'}</Text>
            </View>
            <View style={styles.metaItem}>
                <Icon name="calendar-month-outline" size={16} color={theme.colors.secondary || 'grey'} />
                <Text style={[styles.metaText, { color: theme.colors.secondary || 'grey' }]}> {new Date(documentDetails.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.metaItem}>
                <Icon name="weight-kilogram" size={16} color={theme.colors.secondary || 'grey'} />
                <Text style={[styles.metaText, { color: theme.colors.secondary || 'grey' }]}> {fileSize}</Text>
            </View>
        </View>

        {documentDetails.description && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Mô tả</Text>
            <Text style={[styles.description, { color: theme.colors.text || 'black' }]}>
              {documentDetails.description}
            </Text>
          </View>
        )}
        
        {documentDetails.tags && documentDetails.tags.length > 0 && (
            <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Tags</Text>
                <View style={styles.tagsContainer}>
                    {documentDetails.tags.map((tag, index) => (
                        <View key={index} style={[styles.tag, { backgroundColor: theme.colors.primary + '30'}]}>
                            <Text style={[styles.tagText, {color: theme.colors.primary}]}>{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>
        )}

        <View style={styles.actionsContainer}>
            <Button title="Tải xuống" onPress={handleDownload} color={theme.colors.primary} />
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  contentView: {
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  docIcon: {
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metaInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f0f0f015',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    marginLeft: 5,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
  },
  actionsContainer: {
    marginTop: 20,
  },
});

export default DocumentDetailScreen; 