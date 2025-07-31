const axios = require('axios');

class CompleteAPITester {
  constructor(baseURL = 'http://localhost:5000') {
    this.baseURL = baseURL;
    this.cookies = [];
    this.testData = {
      admin: null,
      owner: null,
      tenant: null,
      society: null,
      building: null,
      flat: null,
      complaint: null,
      announcement: null,
      ownershipRequest: null,
      maintenance: null,
      rent: null
    };
    this.testResults = {
      total: 59,
      passed: 0,
      failed: 0,
      skipped: 0,
      details: []
    };
  }

  // Helper function to delay execution
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeRequest(method, endpoint, data = null, headers = {}) {
    try {
      // Add a longer delay to avoid rate limiting
      await this.sleep(2000);
      
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        withCredentials: true
      };

      if (data) {
        config.data = data;
      }

      if (this.cookies.length > 0) {
        config.headers.Cookie = this.cookies.join('; ');
      }

      const response = await axios(config);
      
      if (response.headers['set-cookie']) {
        const newCookies = response.headers['set-cookie'].map(cookie => cookie.split(';')[0]);
        this.cookies = [...this.cookies, ...newCookies];
      }
      
      console.log(`✅ ${method} ${endpoint} - Status: ${response.status}`);
      this.recordTestResult(method, endpoint, true);
      return { status: response.status, data: response.data };
    } catch (error) {
      console.error(`❌ ${method} ${endpoint} - Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      // Log detailed error information if available
      if (error.response?.data?.errors) {
        console.error('Validation errors:', JSON.stringify(error.response.data.errors, null, 2));
      }
      this.recordTestResult(method, endpoint, false, error.response?.status, error.response?.data?.message || error.message);
      return { status: error.response?.status || 500, data: error.response?.data || null };
    }
  }

  recordTestResult(method, endpoint, success, statusCode = null, errorMessage = null) {
    const result = {
      method,
      endpoint,
      success,
      timestamp: new Date().toISOString()
    };

    if (!success) {
      result.statusCode = statusCode;
      result.errorMessage = errorMessage;
    }

    if (success) {
      this.testResults.passed++;
    } else {
      this.testResults.failed++;
    }

    this.testResults.details.push(result);
  }

  resetCookies() {
    this.cookies = [];
    console.log('🔄 Cookies reset');
  }

  async runCompleteTest() {
    console.log('🚀 Starting Complete API Test\n');
    console.log(`📊 Total APIs to test: ${this.testResults.total}\n`);
    
    try {
      // Test all authentication APIs
      await this.testAuthAPIs();
      
      // Test admin APIs - This creates society, building, flats which are needed for other tests
      await this.testAdminAPIs();
      
      // Only proceed with other tests if we have a society and flat created
      if (this.testData.society && this.testData.flat) {
        // Test owner APIs
        await this.testOwnerAPIs();
        
        // Test tenant APIs
        await this.testTenantAPIs();
        
        // Test complaint APIs
        await this.testComplaintAPIs();
        
        // Test announcement APIs
        await this.testAnnouncementAPIs();
        
        // Test ownership request APIs
        await this.testOwnershipRequestAPIs();
      } else {
        console.log('\n⚠️ Society or flat creation failed, skipping dependent tests');
        this.testResults.skipped = this.testResults.total - this.testResults.passed - this.testResults.failed;
      }
    } catch (error) {
      console.error('\n❌ Test execution error:', error.message);
    }
    
    // Print test summary
    this.printTestSummary();
    
    console.log('\n✅ Complete API test finished!');
  }

  printTestSummary() {
    console.log('\n📊 Test Summary:');
    console.log(`Total APIs: ${this.testResults.total}`);
    console.log(`Passed: ${this.testResults.passed}`);
    console.log(`Failed: ${this.testResults.failed}`);
    console.log(`Skipped: ${this.testResults.skipped}`);
    
    if (this.testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      const failedTests = this.testResults.details.filter(test => !test.success);
      failedTests.forEach((test, index) => {
        console.log(`${index + 1}. ${test.method} ${test.endpoint} - Status: ${test.statusCode} - ${test.errorMessage}`);
      });
    }
  }

  async testAuthAPIs() {
    console.log('\n🔐 Testing Authentication APIs...');
    
    // 1. Register admin user
    const adminTimestamp = Date.now();
    const adminEmail = `admin${adminTimestamp}@example.com`;
    
    const adminRegisterResponse = await this.makeRequest('POST', '/api/auth/register', {
      name: 'Admin User',
      email: adminEmail,
      password: 'admin123',
      phone: '+1234567890',
      role: 'admin'
    });

    if (adminRegisterResponse.status === 201 && adminRegisterResponse.data) {
      this.testData.admin = adminRegisterResponse.data.data;
      console.log('✅ Admin registered:', this.testData.admin.name);
      
      // 2. Register owner user
      const ownerTimestamp = Date.now();
      const ownerEmail = `owner${ownerTimestamp}@example.com`;
      
      const ownerRegisterResponse = await this.makeRequest('POST', '/api/auth/register', {
        name: 'Owner User',
        email: ownerEmail,
        password: 'owner123',
        phone: '+1234567891',
        role: 'owner'
      });

      if (ownerRegisterResponse.status === 201 && ownerRegisterResponse.data) {
        this.testData.owner = ownerRegisterResponse.data.data;
        console.log('✅ Owner registered:', this.testData.owner.name);
        
        // 3. Register tenant user
        const tenantTimestamp = Date.now();
        const tenantEmail = `tenant${tenantTimestamp}@example.com`;
        
        const tenantRegisterResponse = await this.makeRequest('POST', '/api/auth/register', {
          name: 'Tenant User',
          email: tenantEmail,
          password: 'tenant123',
          phone: '+1234567892',
          role: 'tenant'
        });

        if (tenantRegisterResponse.status === 201 && tenantRegisterResponse.data) {
          this.testData.tenant = tenantRegisterResponse.data.data;
          console.log('✅ Tenant registered:', this.testData.tenant.name);
          
          // 4. Test login for admin
          this.resetCookies();
          const adminLoginResponse = await this.makeRequest('POST', '/api/auth/login', {
            email: adminEmail,
            password: 'admin123'
          });

          if (adminLoginResponse.status === 200) {
            console.log('✅ Admin login successful');
            
            // 5. Test get current user
            await this.makeRequest('GET', '/api/auth/me');
            
            // 6. Test change password
            await this.makeRequest('PATCH', '/api/auth/change-password', {
              currentPassword: 'admin123',
              newPassword: 'admin1234',
              confirmPassword: 'admin1234'
            });
            
            // 7. Test logout
            await this.makeRequest('POST', '/api/auth/logout');
            
            // 8. Test login with new password
            await this.makeRequest('POST', '/api/auth/login', {
              email: adminEmail,
              password: 'admin1234'
            });
          }
        }
      }
    }
  }

  async testAdminAPIs() {
    console.log('\n👨‍💼 Testing Admin APIs...');
    
    // Ensure we're logged in as admin
    this.resetCookies();
    const adminEmail = this.testData.admin?.email || `admin${Date.now() - 1000}@example.com`;
    const adminLoginResponse = await this.makeRequest('POST', '/api/auth/login', {
      email: adminEmail,
      password: 'admin1234' // Using the changed password
    });

    if (adminLoginResponse.status === 200) {
      console.log('✅ Admin login successful for API testing');
      
      // 1. Test society management
      // Create society
      const societyData = {
        name: 'Test Society',
        registrationNumber: `REG${Date.now()}`,
        address: '123 Test Street, Test City, Test State, 123456',
        maintenancePolicy: 'Monthly maintenance of 1000 per flat'
      };
      
      const societyResponse = await this.makeRequest('POST', '/api/admin/societies', societyData);
      
      // Log the full response for debugging
      console.log('Society creation response:', JSON.stringify(societyResponse.data, null, 2));
      
      if (societyResponse.status === 201 && societyResponse.data) {
        this.testData.society = societyResponse.data.data;
        console.log('✅ Society created successfully');
        
        // Get admin's societies
        await this.makeRequest('GET', '/api/admin/societies/my');
        
        // Update society
        // Debug log for admin user ID and cookies
        console.log('DEBUG: Admin user ID:', this.testData.admin?._id);
        console.log('DEBUG: Cookies before update:', this.cookies);
        await this.makeRequest('PUT', `/api/admin/societies/${this.testData.society._id}`, {
          name: 'Updated Test Society'
        });
        
        // 2. Test building management
        // Create building
        const buildingResponse = await this.makeRequest('POST', '/api/admin/buildings', {
          name: 'Test Building',
          societyId: this.testData.society._id,
          society: this.testData.society._id,
          totalFloors: 5,
          totalFlats: 20,
          addressLabel: 'Wing A'
        });
        
        if (buildingResponse.status === 201 && buildingResponse.data) {
          this.testData.building = buildingResponse.data.data;
          console.log('✅ Building created successfully');
          
          // Update building
          await this.makeRequest('PUT', `/api/admin/buildings/${this.testData.building._id}`, {
            name: 'Updated Test Building',
            totalFloors: 6,
            addressLabel: 'Updated Wing A'
          });
          
          // Fetch all flats and filter by building
          let allFlatsResponse = await this.makeRequest('GET', '/api/admin/flats');
          let flats = [];
          if (allFlatsResponse.status === 200 && allFlatsResponse.data && allFlatsResponse.data.data) {
            flats = allFlatsResponse.data.data.filter(f => f.building === this.testData.building._id || (f.building && f.building._id === this.testData.building._id));
          }
          if (!flats || flats.length === 0) {
            // Create flats if none exist
            const flatsResponse = await this.makeRequest('POST', '/api/admin/flats', {
              buildingId: this.testData.building._id,
              totalFlats: 4
            });
            if (flatsResponse.status === 201 && flatsResponse.data && flatsResponse.data.data) {
              flats = flatsResponse.data.data;
            }
          }
          this.testData.flats = flats;
          if (flats && flats.length > 0) {
            this.testData.flat = flats[0];
            console.log(`✅ ${flats.length} flats available for testing`);
          } else {
            console.error('❌ No flats available for testing');
            return; // Skip dependent tests if no flats
          }
          
          // 3. Test flat management
          // Create flats
          // This block is now redundant as flats are fetched or created above
          // const flatsResponse = await this.makeRequest('POST', '/api/admin/flats', {
          //   buildingId: this.testData.building._id,
          //   totalFlats: 4
          // });
          
          // if (flatsResponse.status === 201 && flatsResponse.data) {
          //   this.testData.flats = flatsResponse.data.data;
          //   if (this.testData.flats && this.testData.flats.length > 0) {
          //     this.testData.flat = this.testData.flats[0];
          //     console.log(`✅ ${this.testData.flats.length} flats created successfully`);
          //   }
          // }
          
          // Assign flat owner
          await this.makeRequest('PATCH', `/api/admin/flats/${this.testData.flat._id}/assign-owner`, {
            ownerId: this.testData.owner._id
          });
          
          // Assign tenant to flat for rent generation
          await this.makeRequest('PATCH', `/api/admin/flats/${this.testData.flat._id}/assign-tenant`, {
            tenantId: this.testData.tenant._id
          });
          
          // Update flat with rent amount
          await this.makeRequest('PATCH', `/api/admin/flats/${this.testData.flat._id}`, {
            rentAmount: 10000
          });
          
          // 4. Test user management
          // Get all users
          await this.makeRequest('GET', '/api/admin/users');
          
          // Get user by ID
          await this.makeRequest('GET', `/api/admin/users/${this.testData.owner._id}`);
          
          // Update user
          await this.makeRequest('PATCH', `/api/admin/users/${this.testData.owner._id}`, {
            name: 'Updated Owner Name'
          });
          
          // Skip toggle user status to avoid deactivating the owner
          // await this.makeRequest('PATCH', `/api/admin/users/${this.testData.owner._id}/toggle-status`);
          
          // 5. Test rent management
          // Generate rent
          const rentResponse = await this.makeRequest('POST', '/api/admin/rent/generate', {
            billingMonth: new Date().toISOString().slice(0, 7), // YYYY-MM format
            societyId: this.testData.society._id
          });
          
          if (rentResponse.status === 201 && rentResponse.data) {
            this.testData.rent = rentResponse.data.data;
            console.log('✅ Rent generated successfully');
            
            // Get rent history
            await this.makeRequest('GET', '/api/admin/rent/history');
            
            // 6. Test maintenance management
            // Generate maintenance
            const maintenanceResponse = await this.makeRequest('POST', '/api/admin/maintenance', {
              societyId: this.testData.society._id,
              billingMonth: new Date().toISOString().slice(0, 7) // YYYY-MM format
            });
            
            if (maintenanceResponse.status === 201 && maintenanceResponse.data) {
              this.testData.maintenance = maintenanceResponse.data.data;
              console.log('✅ Maintenance generated successfully');
              
              // Get maintenance status
              await this.makeRequest('GET', '/api/admin/maintenance/status');
              
              // 7. Test dashboard
              // Get admin dashboard
              await this.makeRequest('GET', '/api/admin/dashboard/overview');
              
              // Get flat info
              await this.makeRequest('GET', `/api/admin/flats/${this.testData.flat._id}/info`);
              
              // 8. Test notes & reminders
              // Add society note
              await this.makeRequest('PATCH', `/api/admin/societies/${this.testData.society._id}/note`, {
                note: 'Test society note'
              });
              
              // Send reminder to user
              await this.makeRequest('POST', `/api/admin/users/${this.testData.owner._id}/reminder`, {
                message: 'Test reminder message',
                subject: 'Test reminder'
              });
            }
          }
        }
      }
    }
  }

  async testOwnerAPIs() {
    console.log('\n🏠 Testing Owner APIs...');
    
    // Ensure we're logged in as owner
    this.resetCookies();
    const ownerEmail = this.testData.owner?.email || `owner${Date.now() - 1000}@example.com`;
    const ownerLoginResponse = await this.makeRequest('POST', '/api/auth/login', {
      email: ownerEmail,
      password: 'owner123'
    });

    if (ownerLoginResponse.status === 200) {
      console.log('✅ Owner login successful for API testing');
      
      // 1. Test dashboard & profile
      // Get owner dashboard
      await this.makeRequest('GET', '/api/owner/dashboard/overview');
      
      // Update owner profile
      await this.makeRequest('PATCH', '/api/auth/profile', {
        name: 'Updated Owner Profile',
        phone: '+1234567899'
      });
      
      // 2. Test flat management
      // Get owner's flats
      await this.makeRequest('GET', '/api/owner/flats');
      
      // Get flat society info
      if (this.testData.flat && this.testData.flat._id) {
        await this.makeRequest('GET', `/api/owner/flats/${this.testData.flat._id}/society`);
      }
      
      // 3. Test rent & maintenance
      // Get rent history
      await this.makeRequest('GET', '/api/owner/rent-history');
      
      // Get unpaid maintenance
      await this.makeRequest('GET', '/api/owner/maintenance-due');
      
      // Pay maintenance
      if (this.testData.maintenance && this.testData.maintenance._id) {
        await this.makeRequest('PATCH', `/api/owner/maintenance/${this.testData.maintenance._id}/pay`, {
          paymentMethod: 'online',
          transactionId: `TXN${Date.now()}`
        });
      }
      
      // 4. Test ownership requests
      // Create ownership request
      if (this.testData.flat && this.testData.flat._id) {
        const ownershipRequestResponse = await this.makeRequest('POST', '/api/owner/ownership-requests', {
          flatId: this.testData.flat._id,
          newOwnerName: 'New Owner Name',
          newOwnerEmail: 'newowner@example.com',
          newOwnerPhone: '+1234567890',
          reason: 'I want to transfer ownership of this flat to my family member due to relocation.'
        });
        
        if (ownershipRequestResponse.status === 201 && ownershipRequestResponse.data) {
          this.testData.ownershipRequest = ownershipRequestResponse.data.data;
          console.log('✅ Ownership request created successfully');
          
          // Get my ownership requests
          await this.makeRequest('GET', '/api/owner/ownership-requests/my');
        }
      }
    }
  }

  async testTenantAPIs() {
    console.log('\n👤 Testing Tenant APIs...');
    
    // Ensure we're logged in as tenant
    this.resetCookies();
    const tenantEmail = this.testData.tenant?.email || `tenant${Date.now() - 2000}@example.com`;
    const tenantLoginResponse = await this.makeRequest('POST', '/api/auth/login', {
      email: tenantEmail,
      password: 'tenant123'
    });

    if (tenantLoginResponse.status === 200) {
      console.log('✅ Tenant login successful for API testing');
      
      // 1. Test dashboard & profile
      // Get tenant dashboard
      await this.makeRequest('GET', '/api/tenant/dashboard/overview');
      
      // Update tenant profile
      await this.makeRequest('PATCH', '/api/auth/profile', {
        name: 'Updated Tenant Name',
        phone: '+9876543210'
      });
      
      // 2. Test flat & rent management
      // Get tenant's flat
      await this.makeRequest('GET', '/api/tenant/my-flat');
      
      // Get rent history
      await this.makeRequest('GET', '/api/tenant/rent-history');
      
      // Get rent due
      await this.makeRequest('GET', '/api/tenant/rent/due');
      
      // Get maintenance due
      await this.makeRequest('GET', '/api/tenant/maintenance-due');
      
      // Get announcements
      await this.makeRequest('GET', '/api/tenant/announcements');
    }
  }

  async testComplaintAPIs() {
    console.log('\n📝 Testing Complaint APIs...');
    
    // 1. Test owner complaint creation
    this.resetCookies();
    const ownerEmail = this.testData.owner?.email || `owner${Date.now() - 1000}@example.com`;
    await this.makeRequest('POST', '/api/auth/login', {
      email: ownerEmail,
      password: 'owner123'
    });
    
    const ownerComplaintResponse = await this.makeRequest('POST', '/api/complaints', {
      category: 'electrical',
      subject: 'Electrical issue in kitchen',
      description: 'There is an electrical problem in the kitchen that needs to be fixed.',
      flatId: this.testData.flat?._id || null
    });
    
    if (ownerComplaintResponse.status === 201 && ownerComplaintResponse.data) {
      this.testData.complaint = ownerComplaintResponse.data.data;
      console.log('✅ Owner complaint created successfully');
      
      // Get owner's complaints
      await this.makeRequest('GET', '/api/complaints/my');
    }
    
    // 2. Test tenant complaint creation
    this.resetCookies();
    const tenantEmail = this.testData.tenant?.email || `tenant${Date.now() - 1000}@example.com`;
    await this.makeRequest('POST', '/api/auth/login', {
      email: tenantEmail,
      password: 'tenant123'
    });
    
    await this.makeRequest('POST', '/api/complaints', {
      category: 'plumbing',
      subject: 'Water leakage in bathroom',
      description: 'There is a water leakage in the bathroom that needs immediate attention.',
      flatId: this.testData.flat?._id || null
    });
    
    // Get tenant's complaints
    await this.makeRequest('GET', '/api/complaints/my');
    
    // 3. Test admin complaint management
    this.resetCookies();
    const adminEmail = this.testData.admin?.email || `admin${Date.now() - 2000}@example.com`;
    await this.makeRequest('POST', '/api/auth/login', {
      email: adminEmail,
      password: 'admin1234'
    });
    
    // Get all complaints
    await this.makeRequest('GET', '/api/complaints');
    
    // Update complaint status
    if (this.testData.complaint && this.testData.complaint._id) {
      await this.makeRequest('PATCH', `/api/complaints/${this.testData.complaint._id}`, {
        status: 'in-progress',
        adminResponse: 'Working on this issue'
      });
    }
  }

  async testAnnouncementAPIs() {
    console.log('\n📢 Testing Announcement APIs...');
    
    // 1. Test admin announcement management
    this.resetCookies();
    const adminEmail = this.testData.admin?.email || `admin${Date.now() - 2000}@example.com`;
    await this.makeRequest('POST', '/api/auth/login', {
      email: adminEmail,
      password: 'admin1234'
    });
    
    // Create announcement
    const announcementResponse = await this.makeRequest('POST', '/api/announcements', {
      title: 'Test Announcement',
      content: 'This is a test announcement',
      type: 'general',
      societyId: this.testData.society?._id,
      audience: ['all'],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    
    if (announcementResponse.status === 201 && announcementResponse.data) {
      this.testData.announcement = announcementResponse.data.data;
      console.log('✅ Announcement created successfully');
      
      // Get all announcements
      await this.makeRequest('GET', '/api/announcements');
      
      // Update announcement
      if (this.testData.announcement && this.testData.announcement._id) {
        await this.makeRequest('PUT', `/api/announcements/${this.testData.announcement._id}`, {
          title: 'Updated Test Announcement',
          content: 'This is an updated test announcement',
          type: 'important'
        });
      }
      
      // 2. Test user announcement viewing
      // Owner view announcements
      this.resetCookies();
      const ownerEmail = this.testData.owner?.email || `owner${Date.now() - 1000}@example.com`;
      await this.makeRequest('POST', '/api/auth/login', {
        email: ownerEmail,
        password: 'owner123'
      });
      
      await this.makeRequest('GET', '/api/announcements/relevant');
      
      // Tenant view announcements
      this.resetCookies();
      const tenantEmail = this.testData.tenant?.email || `tenant${Date.now() - 1000}@example.com`;
      await this.makeRequest('POST', '/api/auth/login', {
        email: tenantEmail,
        password: 'tenant123'
      });
      
      await this.makeRequest('GET', '/api/announcements/relevant');
      
      // 3. Test announcement deletion
      this.resetCookies();
      await this.makeRequest('POST', '/api/auth/login', {
        email: adminEmail,
        password: 'admin1234'
      });
      
      if (this.testData.announcement && this.testData.announcement._id) {
        await this.makeRequest('DELETE', `/api/announcements/${this.testData.announcement._id}`);
      }
    }
  }

  async testOwnershipRequestAPIs() {
    console.log('\n📋 Testing Ownership Request APIs...');
    
    // 1. Test owner ownership request creation
    this.resetCookies();
    const ownerEmail = this.testData.owner?.email || `owner${Date.now() - 1000}@example.com`;
    await this.makeRequest('POST', '/api/auth/login', {
      email: ownerEmail,
      password: 'owner123'
    });
    
    if (this.testData.flat && this.testData.flat._id) {
      const ownershipRequestResponse = await this.makeRequest('POST', '/api/owner/ownership-requests', {
        flatId: this.testData.flat._id,
        newOwnerName: 'New Owner Name',
        newOwnerEmail: 'newowner@example.com',
        newOwnerPhone: '+1234567890',
        reason: 'I want to transfer ownership of this flat to my family member due to relocation.'
      });
      
      if (ownershipRequestResponse.status === 201 && ownershipRequestResponse.data) {
        this.testData.ownershipRequest = ownershipRequestResponse.data.data;
        console.log('✅ Ownership request created successfully');
        
        // Get my ownership requests
        await this.makeRequest('GET', '/api/owner/ownership-requests/my');
        
        // 2. Test admin ownership request management
        this.resetCookies();
        const adminEmail = this.testData.admin?.email || `admin${Date.now() - 2000}@example.com`;
        await this.makeRequest('POST', '/api/auth/login', {
          email: adminEmail,
          password: 'admin1234'
        });
        
        // Get all ownership requests
        const adminRequestsResponse = await this.makeRequest('GET', '/api/admin/ownership-requests');
        
        if (adminRequestsResponse.status === 200 && adminRequestsResponse.data && 
            adminRequestsResponse.data.data && adminRequestsResponse.data.data.length > 0) {
          const requestId = adminRequestsResponse.data.data[0]._id;
          
          // Review ownership request
          await this.makeRequest('PATCH', '/api/admin/ownership-requests/review', {
            requestId,
            status: 'approved',
            reviewNotes: 'Approved by admin'
          });
        }
      }
    }
  }
}

// Run the complete test
if (require.main === module) {
  const tester = new CompleteAPITester();
  tester.runCompleteTest();
}

module.exports = CompleteAPITester;