import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, ImageBackground,
    StatusBar, ActivityIndicator, Alert
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { theme } from '../Global/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../Services/authService';
import { setUser, setError } from '../Features/auth/authSlice';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too short').required('Required'),
});

export default function Login({ navigation }: any) {
    const [isLoading, setIsLoading] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const dispatch = useDispatch();

    const handleAuth = async (values: any) => {
        setIsLoading(true);
        try {
            const user = isRegisterMode
                ? await registerUser(values.email, values.password)
                : await loginUser(values.email, values.password);

            dispatch(setUser(user));
            navigation.navigate("MainTabs");
        } catch (error: any) {
            dispatch(setError(error.message));
            Alert.alert(
                isRegisterMode ? 'Registration Failed' : 'Login Failed',
                error.message
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop' }}
                style={styles.backgroundImage}
            >
                <LinearGradient
                    colors={['rgba(18,18,18,0.4)', 'rgba(18,18,18,0.9)', '#121212']}
                    style={styles.flex}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.flex}
                    >
                        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                            <View style={styles.header}>
                                <View style={styles.logoCircle}>
                                    <Ionicons name="film-outline" size={40} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.title}>CineDiscover</Text>
                                <Text style={styles.subtitle}>Enter the world of cinema</Text>
                            </View>

                            <Formik
                                initialValues={{ email: '', password: '' }}
                                validationSchema={LoginSchema}
                                onSubmit={handleAuth}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                    <View style={styles.formCard}>
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Email address</Text>
                                            <View style={[styles.inputWrapper, touched.email && errors.email && styles.inputError]}>
                                                <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} />
                                                <TextInput
                                                    style={styles.input}
                                                    onChangeText={handleChange('email')}
                                                    onBlur={handleBlur('email')}
                                                    value={values.email}
                                                    placeholder="name@example.com"
                                                    placeholderTextColor="#64748B"
                                                    keyboardType="email-address"
                                                    autoCapitalize="none"
                                                />
                                            </View>
                                            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <View style={styles.labelRow}>
                                                <Text style={styles.label}>Password</Text>
                                                {!isRegisterMode && (
                                                    <TouchableOpacity>
                                                        <Text style={styles.forgotText}>Forgot password?</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                            <View style={[styles.inputWrapper, touched.password && errors.password && styles.inputError]}>
                                                <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
                                                <TextInput
                                                    style={styles.input}
                                                    onChangeText={handleChange('password')}
                                                    onBlur={handleBlur('password')}
                                                    value={values.password}
                                                    placeholder="••••••••"
                                                    placeholderTextColor="#64748B"
                                                    secureTextEntry
                                                />
                                            </View>
                                            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                                        </View>

                                        <TouchableOpacity
                                            style={styles.loginButton}
                                            onPress={() => handleSubmit()}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator color="black" />
                                            ) : (
                                                <>
                                                    <Text style={styles.loginButtonText}>
                                                        {isRegisterMode ? 'Create Account' : 'Sign In'}
                                                    </Text>
                                                    <Ionicons name="arrow-forward" size={20} color="black" />
                                                </>
                                            )}
                                        </TouchableOpacity>

                                        <View style={styles.dividerRow}>
                                            <View style={styles.line} />
                                            <Text style={styles.dividerText}> OR CONTINUE WITH </Text>
                                            <View style={styles.line} />
                                        </View>

                                        <View style={styles.socialRow}>
                                            <TouchableOpacity style={styles.socialButton}>
                                                <Ionicons name="logo-google" size={24} color="white" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.socialButton}>
                                                <Ionicons name="logo-apple" size={24} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </Formik>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    {isRegisterMode ? 'Already have an account? ' : "New here? "}
                                </Text>
                                <TouchableOpacity onPress={() => setIsRegisterMode(!isRegisterMode)}>
                                    <Text style={styles.registerText}>
                                        {isRegisterMode ? 'Sign In' : 'Create an account'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    flex: { flex: 1 },
    scrollContent: {
        flexGrow: 1,
        padding: theme.spacing.l,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0, 214, 164, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 214, 164, 0.3)',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 4,
    },
    formCard: {
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        ...theme.shadows.light,
    },
    inputGroup: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    forgotText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    input: {
        flex: 1,
        color: 'white',
        marginLeft: 12,
        fontSize: 16,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    loginButton: {
        backgroundColor: theme.colors.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        ...theme.shadows.glow,
    },
    loginButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    dividerText: {
        color: '#64748B',
        fontSize: 10,
        fontWeight: 'bold',
        paddingHorizontal: 12,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    footerText: {
        color: '#64748B',
    },
    registerText: {
        color: 'white',
        fontWeight: 'bold',
    }
});
