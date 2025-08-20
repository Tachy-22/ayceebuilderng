"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Database
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DebugInfo {
  authUser: any;
  firestoreUser: any;
  hasAdminRole: boolean;
  canWriteToFirestore: boolean;
  errors: string[];
}

export default function AuthDebug() {
  const { user, userProfile } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const runDebug = async () => {
    setLoading(true);
    const info: DebugInfo = {
      authUser: null,
      firestoreUser: null,
      hasAdminRole: false,
      canWriteToFirestore: false,
      errors: []
    };

    try {
      // Check authenticated user
      if (user) {
        info.authUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        };

        // Check Firestore user document
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            info.firestoreUser = userDoc.data();
            info.hasAdminRole = userDoc.data()?.role === 'admin';
          } else {
            info.errors.push('User document does not exist in Firestore');
          }
        } catch (firestoreError) {
          info.errors.push(`Error reading user document: ${firestoreError instanceof Error ? firestoreError.message : 'Unknown error'}`);
        }

        // Test Firestore write permissions
        try {
          const testDocRef = doc(db, 'test', `auth-test-${Date.now()}`);
          await setDoc(testDocRef, {
            testMessage: 'Admin permission test',
            timestamp: new Date(),
            userId: user.uid
          });
          info.canWriteToFirestore = true;
        } catch (writeError) {
          info.canWriteToFirestore = false;
          info.errors.push(`Firestore write test failed: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
        }
      } else {
        info.errors.push('No authenticated user');
      }

    } catch (error) {
      info.errors.push(`Debug error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setDebugInfo(info);
    setLoading(false);
  };

  const fixAdminRole = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Admin User',
        role: 'admin', // Set admin role
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true }); // Use merge to not overwrite existing data
      
      alert('Admin role set successfully! Please refresh and try again.');
      runDebug(); // Re-run debug
    } catch (error) {
      alert(`Failed to set admin role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      runDebug();
    }
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Admin Authentication Debug
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runDebug}
            disabled={loading}
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!user ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No user is currently authenticated. Please log in to the admin panel.
            </AlertDescription>
          </Alert>
        ) : (
          debugInfo && (
            <div className="space-y-4">
              {/* Auth User Info */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Firebase Auth User
                </h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div><strong>UID:</strong> {debugInfo.authUser.uid}</div>
                  <div><strong>Email:</strong> {debugInfo.authUser.email}</div>
                  <div><strong>Display Name:</strong> {debugInfo.authUser.displayName || 'Not set'}</div>
                  <div><strong>Email Verified:</strong> {debugInfo.authUser.emailVerified ? 'Yes' : 'No'}</div>
                </div>
              </div>

              {/* Firestore User Info */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  {debugInfo.firestoreUser ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  Firestore User Document
                </h3>
                {debugInfo.firestoreUser ? (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <div><strong>Role:</strong> {debugInfo.firestoreUser.role || 'Not set'}</div>
                    <div><strong>Name:</strong> {debugInfo.firestoreUser.name || 'Not set'}</div>
                    <div><strong>Created:</strong> {debugInfo.firestoreUser.createdAt?.toDate?.()?.toLocaleString() || 'Not set'}</div>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      User document not found in Firestore
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Admin Role Status */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  {debugInfo.hasAdminRole ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  Admin Role Status
                </h3>
                <Badge variant={debugInfo.hasAdminRole ? "default" : "destructive"}>
                  {debugInfo.hasAdminRole ? "Has Admin Role" : "Missing Admin Role"}
                </Badge>
              </div>

              {/* Firestore Write Test */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  {debugInfo.canWriteToFirestore ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  Firestore Write Permissions
                </h3>
                <Badge variant={debugInfo.canWriteToFirestore ? "default" : "destructive"}>
                  {debugInfo.canWriteToFirestore ? "Can Write" : "Cannot Write"}
                </Badge>
              </div>

              {/* Errors */}
              {debugInfo.errors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    Errors
                  </h3>
                  <div className="space-y-1">
                    {debugInfo.errors.map((error, index) => (
                      <Alert key={index} className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800 text-xs">
                          {error}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {/* Fix Button */}
              {!debugInfo.hasAdminRole && debugInfo.authUser && (
                <div className="pt-4 border-t">
                  <Button 
                    onClick={fixAdminRole}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Setting Admin Role...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Fix Admin Role
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    This will set role: &quot;admin&quot; in your Firestore user document
                  </p>
                </div>
              )}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}