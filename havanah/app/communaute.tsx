import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Stack } from "expo-router";
import { Comment } from '../types/Comment';
import { User } from '../types/User';
import { commentService } from '../services/commentService';
import { userService } from '../services/userService';
import CommentCard from '../components/CommentCard';
import ProfilCard from '../components/ProfilCard';

export default function CommunauteScreen() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profilModalVisible, setProfilModalVisible] = useState(false);

  const loadComments = async () => {
    try {
      const data = await commentService.getComments();
      console.log('Commentaires chargés:', data);
      setComments(data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadComments();
    setRefreshing(false);
  };

  const handleLike = async (commentId: string) => {
    try {
      const updatedFields = await commentService.toggleLike(commentId);
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, ...updatedFields }
            : comment
        )
      );
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const handleUserPress = async (userId: string) => {
    try {
      // En réel, tu ferais un appel API pour récupérer le profil de l'utilisateur
      // Pour le moment, on utilise le profil mock
      const user = await userService.getCurrentUser();
      setSelectedUser(user);
      setProfilModalVisible(true);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const closeProfilModal = () => {
    setProfilModalVisible(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 250);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const renderComment = ({ item }: { item: Comment }) => {
    console.log('Render CommentCard:', item.id, 'isLiked:', item.isLiked, 'likes:', item.likes);
    return (
      <CommentCard 
        comment={item} 
        onLike={handleLike} 
        onUserPress={handleUserPress}
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>
        Découvre les avis de la communauté ! 
      </Text>
      <Text style={styles.headerSubtitle}>
        Partages d'expériences, conseils et découvertes des van lifers
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Aucun commentaire pour le moment</Text>
      <Text style={styles.emptySubtext}>Sois le premier à partager ton expérience !</Text>
    </View>
  );

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>COMMUNAUTÉ</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#34573E" />
            <Text style={styles.loadingText}>Chargement des messages...</Text>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>COMMUNAUTÉ</Text>
        </View>
        
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id} // ✅ clé unique pour chaque commentaire
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#34573E']}
              tintColor="#34573E"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Modal de profil utilisateur */}
      {selectedUser && (
        <ProfilCard 
          user={selectedUser}
          visible={profilModalVisible}
          onClose={closeProfilModal}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#82A189",
  },
  header: {
    backgroundColor: "#34573E",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  pageTitle: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#fff',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
});
