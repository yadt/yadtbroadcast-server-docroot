Summary: yadtbroadcast server docroot
Name: yadtbroadcast-server-docroot
Version: 1.0.14
Release: 1
License: GPL
Vendor: Immobilien Scout GmbH
Packager: arne.hilmann@gmail.com
Group: is24
Source0: %{name}-%{version}.tar.gz
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root
BuildArch: noarch

%description
yadtbroadcast server docroot:
the static content and libraries for the webview

%prep
%setup

%install
rm -rf  %{buildroot}
mkdir -p %{buildroot}
cp -av src/* %{buildroot}/
find %{buildroot} -type f -printf "/%%P\n" >files.lst
mkdir -p %{buildroot}/var/yadtbroadcast-server/docroot

%files -f files.lst
%defattr(-,root,root,0755)

%pre

%clean
%{__rm} -rf %{buildroot}

