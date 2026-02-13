import requests
import sys
import json
import base64
from datetime import datetime

class RecellAPITester:
    def __init__(self):
        # Use the public backend URL from frontend/.env
        self.base_url = "https://device-supply.preview.emergentagent.com/api"
        self.admin_username = "admin"
        self.admin_password = "recell2024!"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_enquiry_id = None

    def get_auth_header(self):
        """Get Basic Auth header for admin endpoints"""
        credentials = f"{self.admin_username}:{self.admin_password}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        return {"Authorization": f"Basic {encoded_credentials}"}

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response data keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Not dict'}")
                    return True, response_data
                except:
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                return False, {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_public_endpoints(self):
        """Test all public endpoints"""
        print("=" * 50)
        print("TESTING PUBLIC ENDPOINTS")
        print("=" * 50)
        
        # Test root endpoint
        self.run_test("Root API endpoint", "GET", "", 200)
        
        # Test FAQ endpoint
        success, faq_data = self.run_test("FAQ endpoint", "GET", "faq", 200)
        if success and isinstance(faq_data, list):
            print(f"   Found {len(faq_data)} FAQ items")
        
        # Test stock summary endpoint
        success, stock_data = self.run_test("Stock summary endpoint", "GET", "stock-summary", 200)
        if success and isinstance(stock_data, dict) and 'categories' in stock_data:
            print(f"   Found {len(stock_data['categories'])} product categories")
        
        # Test enquiry submission
        enquiry_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "company": "Test Company Ltd",
            "email": "test@testcompany.com",
            "phone": "+353123456789",
            "region": "Europe",
            "volume": "200–500 units",
            "products": "iPhone",
            "grade": "Grade A",
            "message": "This is a test enquiry from automated testing. Please ignore."
        }
        
        success, enquiry_response = self.run_test(
            "Enquiry submission", 
            "POST", 
            "enquiries", 
            200, 
            data=enquiry_data
        )
        
        if success and isinstance(enquiry_response, dict) and 'id' in enquiry_response:
            self.test_enquiry_id = enquiry_response['id']
            print(f"   Created test enquiry with ID: {self.test_enquiry_id}")

    def test_admin_endpoints(self):
        """Test admin endpoints with authentication"""
        print("\n" + "=" * 50)
        print("TESTING ADMIN ENDPOINTS")
        print("=" * 50)
        
        auth_headers = self.get_auth_header()
        
        # Test admin stats
        success, stats_data = self.run_test(
            "Admin stats", 
            "GET", 
            "admin/stats", 
            200, 
            headers=auth_headers
        )
        if success and isinstance(stats_data, dict):
            print(f"   Stats: Total={stats_data.get('total', 0)}, New={stats_data.get('new', 0)}")
        
        # Test admin enquiries list
        success, enquiries_data = self.run_test(
            "Admin enquiries list", 
            "GET", 
            "admin/enquiries", 
            200, 
            headers=auth_headers
        )
        if success and isinstance(enquiries_data, list):
            print(f"   Found {len(enquiries_data)} enquiries")
        
        # Test seed FAQ
        self.run_test(
            "Seed FAQ", 
            "POST", 
            "admin/seed-faq", 
            200, 
            headers=auth_headers
        )
        
        # If we have a test enquiry, test update and delete
        if self.test_enquiry_id:
            # Test update enquiry status
            update_data = {"status": "contacted"}
            success, update_response = self.run_test(
                f"Update enquiry status",
                "PATCH",
                f"admin/enquiries/{self.test_enquiry_id}",
                200,
                data=update_data,
                headers=auth_headers
            )
            
            # Test get single enquiry
            self.run_test(
                f"Get single enquiry",
                "GET",
                f"admin/enquiries/{self.test_enquiry_id}",
                200,
                headers=auth_headers
            )
            
            # Test delete enquiry (cleanup)
            self.run_test(
                f"Delete test enquiry",
                "DELETE",
                f"admin/enquiries/{self.test_enquiry_id}",
                200,
                headers=auth_headers
            )

    def test_authentication(self):
        """Test authentication scenarios"""
        print("\n" + "=" * 50)
        print("TESTING AUTHENTICATION")
        print("=" * 50)
        
        # Test admin endpoint without auth (should fail)
        self.run_test(
            "Admin stats without auth (should fail)", 
            "GET", 
            "admin/stats", 
            401
        )
        
        # Test admin endpoint with wrong credentials (should fail)
        wrong_auth = base64.b64encode(b"wrong:credentials").decode()
        wrong_headers = {"Authorization": f"Basic {wrong_auth}"}
        self.run_test(
            "Admin stats with wrong credentials (should fail)", 
            "GET", 
            "admin/stats", 
            401,
            headers=wrong_headers
        )

    def test_error_cases(self):
        """Test error handling"""
        print("\n" + "=" * 50)
        print("TESTING ERROR CASES")
        print("=" * 50)
        
        # Test invalid enquiry data
        invalid_enquiry = {
            "name": "Test",
            # Missing required fields
        }
        
        self.run_test(
            "Invalid enquiry submission (should fail)",
            "POST",
            "enquiries",
            422,  # Validation error
            data=invalid_enquiry
        )
        
        # Test non-existent enquiry
        auth_headers = self.get_auth_header()
        self.run_test(
            "Get non-existent enquiry (should fail)",
            "GET",
            "admin/enquiries/non-existent-id",
            404,
            headers=auth_headers
        )

def main():
    print("🚀 Starting Re-Cell Technology Solutions API Tests")
    print(f"Testing against: https://device-supply.preview.emergentagent.com/api")
    print("=" * 70)
    
    tester = RecellAPITester()
    
    try:
        # Run all test suites
        tester.test_public_endpoints()
        tester.test_admin_endpoints()
        tester.test_authentication()
        tester.test_error_cases()
        
        # Print final results
        print("\n" + "=" * 70)
        print("📊 FINAL TEST RESULTS")
        print("=" * 70)
        print(f"Tests run: {tester.tests_run}")
        print(f"Tests passed: {tester.tests_passed}")
        print(f"Tests failed: {tester.tests_run - tester.tests_passed}")
        print(f"Success rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
        
        if tester.tests_passed == tester.tests_run:
            print("\n🎉 All tests passed!")
            return 0
        else:
            print(f"\n⚠️  {tester.tests_run - tester.tests_passed} tests failed")
            return 1
            
    except Exception as e:
        print(f"\n💥 Test suite crashed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())