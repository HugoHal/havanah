import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Comment } from '../types/Comment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from '../supabaseClient';

interface CommentCardProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onUserPress?: (userId: string) => void;
}

export default function CommentCard({ comment, onLike, onUserPress }: CommentCardProps) {
  const [userName, setUserName] = useState<string>('Utilisateur');
  const [avatar, setAvatar] = useState<string>('https://via.placeholder.com/40');
  const [targetName, setTargetName] = useState<string>('Lieu inconnu');
  const [isLiked, setIsLiked] = useState(comment.isLiked ?? false);
  const [likes, setLikes] = useState(comment.likes ?? 0);

  useEffect(() => {
    setIsLiked(comment.isLiked ?? false);
    setLikes(comment.likes ?? 0);
  }, [comment.isLiked, comment.likes]);

  useEffect(() => {
    async function fetchUser() {
      if (comment.user_id) {
        const { data } = await supabase
          .from('users')
          .select('pseudo, photo_profil')
          .eq('id', comment.user_id)
          .single();
        if (data) {
          setUserName(data.pseudo || 'Utilisateur');
          setAvatar(data.photo_profil || 'https://via.placeholder.com/40');
        }
      }
    }
    fetchUser();
  }, [comment.user_id]);

  useEffect(() => {
    async function fetchTargetName() {
      if (comment.target_type && comment.target_id) {
        let table = comment.target_type === 'spot' ? 'spots' : 'itineraires';
        const { data } = await supabase
          .from(table)
          .select('nom')
          .eq('id', comment.target_id)
          .single();
        if (data && data.nom) {
          setTargetName(data.nom);
        }
      }
    }
    fetchTargetName();
  }, [comment.target_type, comment.target_id]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Il y a quelques minutes';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  const renderStars = (note: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < note ? "star" : "star-outline"}
        size={16}
        color={index < note ? "#FFD700" : "#ccc"}
      />
    ));
  };

  const getTargetIcon = () => {
    return comment.target_type === 'spot' ? 'location' : 'map';
  };

  const getTargetColor = () => {
    return comment.target_type === 'spot' ? '#FF9900' : '#34573E';
  };

  const handleUserPress = () => {
    if (onUserPress) {
      onUserPress(comment.user_id);
    }
  };

  const handleLikePress = async () => {
    await onLike(comment.id); // Attend la mise à jour serveur
  };

  return (
    <View style={styles.container}>
      {/* En-tête avec utilisateur et cible */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={handleUserPress}>
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.timeStamp}>{formatDate(new Date(comment.created_at))}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.targetInfo}>
          <Ionicons name={getTargetIcon()} size={16} color={getTargetColor()} />
          <Text style={[styles.targetName, { color: getTargetColor() }]}>
            {targetName}
          </Text>
        </View>
      </View>

      {/* Note en étoiles */}
      <View style={styles.ratingContainer}>
        <View style={styles.stars}>
          {renderStars(comment.note)}
        </View>
        <Text style={styles.ratingText}>({comment.note}/5)</Text>
      </View>

      {/* Message */}
      <Text style={styles.message}>{comment.message}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={handleLikePress}
        >
          <Ionicons 
            name={comment.isLiked ? "heart" : "heart-outline"} 
            size={20} 
            color={comment.isLiked ? "#FF3366" : "#666"} 
          />
          <Text style={[styles.likeCount, comment.isLiked && styles.likeCountActive]}>
            {comment.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.replyButton}>
          <Ionicons name="chatbubble-outline" size={18} color="#666" />
          <Text style={styles.replyText}>Répondre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#E7D4BB',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  timeStamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  targetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  targetName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  likeCount: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  likeCountActive: {
    color: '#FF3366',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
});