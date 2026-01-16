import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, useWindowDimensions, Alert } from 'react-native';
import { theme } from '../Global/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../Services/authService';
import { logout } from '../Features/auth/authSlice';
import { RootState } from '../Store/store';

export default function Profile({ navigation }: any) {
    const { width } = useWindowDimensions();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                            dispatch(logout());
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    }
                }
            ]
        );
    };

    const stats = [
        { label: 'WATCHED', value: '124' },
        { label: 'WATCHLIST', value: '48' },
        { label: 'REVIEWS', value: '12' },
    ];

    const MenuOption = ({ icon, title, subtitle, showBorder = true }: any) => (
        <TouchableOpacity style={[styles.menuItem, showBorder && styles.menuBorder]}>
            <View style={styles.menuIconContainer}>
                <Ionicons name={icon} size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#475569" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.headerBtn}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarGlow} />
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8aFzf9PgD04VONRCpKqyQeDfOCt0Gy88XCpX9vXPA9mgJK-P0oSLsw3vHJdrusMmzqKRcbG0s1Eci0ZPMxBJjEwXdSElYBgCNnm9xo-xjPpcPPXl_JOgySWFW4tFMWZxkT-uoJBsZReVSjISGkTcp23kSkkNecGXGPPt5Ta8DoTECnjFMG4TF_cP1L8hm9O_n42J8qqP9whkhvzMZ-5-cCBU-TbfR5sNrR4iqE_Wu-uQaseQEv9K53GJAPiloOpaVxh9pUPMr_RY' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editBtn}>
                            <Ionicons name="pencil" size={16} color="black" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>{user?.displayName || 'CineDiscover User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'user@cinediscover.com'}</Text>

                    <View style={styles.proBadge}>
                        <Ionicons name="shield-checkmark" size={14} color={theme.colors.primary} />
                        <Text style={styles.proBadgeText}>PRO MEMBER</Text>
                    </View>

                    <View style={styles.statsRow}>
                        {stats.map((stat, index) => (
                            <View key={stat.label} style={[styles.statBox, { width: (width - 64) / 3 }]}>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* General Settings */}
                <Text style={styles.sectionLabel}>GENERAL</Text>
                <View style={styles.menuGroup}>
                    <MenuOption
                        icon="person-outline"
                        title="Account Settings"
                        subtitle="Security, password & email"
                    />
                    <MenuOption
                        icon="card-outline"
                        title="Subscription Plan"
                        subtitle="Manage your monthly billing"
                        showBorder={false}
                    />
                </View>

                {/* Application Settings */}
                <Text style={styles.sectionLabel}>APPLICATION</Text>
                <View style={styles.menuGroup}>
                    <MenuOption
                        icon="options-outline"
                        title="App Preferences"
                        subtitle="Notifications & player settings"
                    />
                    <MenuOption
                        icon="cloud-download-outline"
                        title="Downloads"
                        subtitle="Quality and storage management"
                    />
                    <MenuOption
                        icon="help-circle-outline"
                        title="Help Center"
                        subtitle="FAQs and live support"
                        showBorder={false}
                    />
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    profileCard: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    avatarContainer: {
        width: 130,
        height: 130,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarGlow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(0, 214, 164, 0.15)',
        borderWidth: 2,
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    editBtn: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: theme.colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: theme.colors.background,
    },
    userName: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    userEmail: {
        color: '#64748B',
        fontSize: 14,
        marginTop: 4,
    },
    proBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 214, 164, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 214, 164, 0.3)',
        marginTop: 16,
        gap: 6,
    },
    proBadgeText: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        width: '100%',
    },
    statBox: {
        backgroundColor: theme.colors.surface,
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statValue: {
        color: theme.colors.primary,
        fontSize: 22,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#64748B',
        fontSize: 9,
        fontWeight: 'bold',
        marginTop: 4,
        letterSpacing: 0.5,
    },
    sectionLabel: {
        color: '#475569',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 12,
        marginLeft: 4,
    },
    menuGroup: {
        backgroundColor: theme.colors.surface,
        borderRadius: 24,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
    },
    menuBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 214, 164, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    menuSubtitle: {
        color: '#64748B',
        fontSize: 12,
        marginTop: 2,
    },
    logoutBtn: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
