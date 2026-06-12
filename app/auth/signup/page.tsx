import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAFA] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">TM</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-gray-900">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">Join thousands of buyers and sellers in T&amp;T</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone number <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="flex gap-2">
                <span className="px-3 py-2.5 text-sm bg-gray-100 border border-gray-300 rounded-lg text-gray-500">+1 868</span>
                <input
                  id="phone"
                  type="tel"
                  placeholder="xxx-xxxx"
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                id="location"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select your area</option>
                {["Port of Spain", "San Fernando", "Chaguanas", "Arima", "Tunapuna", "Couva", "Fyzabad", "Debe", "Diego Martin", "Maraval", "Other"].map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Min. 8 characters"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-start gap-2">
              <input id="terms" type="checkbox" required className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-700 hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-blue-700 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <Button type="submit" fullWidth size="lg">Create Account</Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-700 font-medium hover:text-blue-800 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
